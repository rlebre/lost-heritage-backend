const upload = require('../services/image-upload');
const arrayUpload = upload.array('image');
const Busboy = require('busboy');
const path = require('path');
const os = require('os');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const aws = require('aws-sdk');
const config = require('../config');

const Image = require('../models/image');


aws.config.update({
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_ACCESS_KEY_SECRET,
    region: 'eu-west-3'
});

var s3 = new aws.S3();

exports.imageUpload = (req, res) => {
    arrayUpload(req, res, (err) => {
        if (err) {
            return res.status(422).send({ errors: [{ title: "Image upload error.", detail: err.message }] });
        }


        return res.json(req.files.map(file => {
            const img = new Image({
                url: file.Location,
                name: file.originalname,
                key: file.key,
                size: file.size,
                postUid: req.query.postUid ? req.query.postUid : uuidv4().toString()
            });

            Image.create(img);

            return img;
        }));
    })
};

exports.imageUploadBusboy = (req, res) => {
    const busboy = new Busboy({
        headers: req.headers,
        limits: {
            fileSize: 10 * 1024 * 1024
        }
    });

    const promises = [];

    let uploadToS3 = function (filepath, file) {
        let uuid = uuidv4();

        return s3.upload({
            ACL: 'public-read',
            Bucket: 'lost-heritage',
            Key: `${uuid}`,
            Body: file
        }).promise();
    }

    busboy.on('file', async function (fieldname, file, filename, encoding, mimetype) {
        let filepath = path.join(os.tmpdir(), filename);
        file.pipe(fs.createWriteStream(filepath));

        promises.push(uploadToS3(filepath, file));
    });

    busboy.on('finish', function () {
        Promise.all(promises).then(function (data) {
            res.send(data.map(item => item.Location));
        }).catch(function (err) {
            res.send(err);
        })
    });

    req.pipe(busboy);
}

exports.imageRemove = (req, res) => {
    const { postUid, key } = req.body;

    Image.findOne({ postUid, key }, (err, foundImage) => {
        if (err) {
            return res.status(422).send({ errors: [{ title: "Image removal error.", detail: err.message }] });
        }

        if (!foundImage) {
            return res.status(422).send({ errors: [{ title: "Image removal error.", detail: 'Image not found.' }] });
        }

        if (!foundImage.isPostCreated) {
            foundImage.remove(function (err) {
                if (err) {
                    return res.status(422).send({ errors: normalizeErrors(err.errors) });
                }

                return res.json({ 'status': 'deleted' });
            });
        }
    });
};