const aws = require('aws-sdk');
const multer = require('multer');
const s3Storage = require('multer-sharp-s3');
const config = require('../config');
const md5 = require('md5');
const { v4: uuidv4 } = require('uuid');

aws.config.update({
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_ACCESS_KEY_SECRET,
    region: 'eu-west-3'
});

var s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG and PNG allowed.'), false);
    }
}

var upload = multer({
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024
    },
    storage: s3Storage({
        ACL: 'public-read',
        s3,
        Bucket: 'lost-heritage',
        Key: function (req, file, cb) {
            let { postUid } = req.query;
            postUid = postUid ? postUid : uuidv4().toString();

            cb(null, md5(file.originalname.concat(postUid)))
        },
        resize: {
            width: 200
        }
    })
});

module.exports = upload;