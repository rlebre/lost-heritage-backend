const User = require('../models/user');
const { normalizeErrors } = require('../helpers/mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config');


exports.getUser = function (req, res) {
    const requestedUserId = req.params.id;
    const user = res.locals.user;

    if (requestedUserId === user.id) {
        User.findById(requestedUserId, function (err, foundUser) {
            if (err) {
                return res.status(422).send({ errors: normalizeErrors(err.errors) });
            }

            return res.json(foundUser);
        })
    } else {
        User.findById(requestedUserId)
            .select('-password')
            .exec(function (err, foundUser) {
                if (err) {
                    return res.status(422).send({ errors: normalizeErrors(err.errors) });
                }

                return res.json(foundUser);
            })
    }
}

exports.auth = function (req, res) {
    const { email, password } = req.body;

    if (!password || !email) {
        return res.status(422).send({ errors: [{ title: "Data missing!", detail: "Provide email and password." }] });
    }

    User.findOne({ email }, function (err, user) {
        if (err) {
            return res.status(422).send({ errors: normalizeErrors(err.errors) });
        }

        if (!user) {
            return res.status(422).send({ errors: [{ title: 'Invalid User!', detail: 'User does not exist.' }] });
        }

        if (user.hasSamePassword(password)) {
            const token = jwt.sign({
                userId: user.id,
                username: user.username
            }, config.JWT_SECRET, { expiresIn: '48h' });

            return res.json({ "jwt": token });
        } else {
            return res.status(422).send({ errors: [{ title: 'Wrong data!', detail: 'Wrong email or password.' }] });
        }
    });
}

exports.register = function (req, res) {
    const { username, email, password, passwordConfirmation } = req.body;

    if (!username | !password || !email) {
        return res.status(422).send({ errors: [{ title: "Data missing!", detail: "Provide username, email and password." }] });
    }

    if (password !== passwordConfirmation) {
        return res.status(422).send({ errors: [{ title: "Invalid password!", detail: "Passwords don't match." }] });
    }

    User.findOne({ email }, function (err, existingUser) {
        if (err) {
            return res.status(422).send({ errors: normalizeErrors(err.errors) });
        }

        if (existingUser) {
            return res.status(422).send({ errors: [{ title: "Invalid email!", detail: "Email is already in use." }] });
        }

        const user = new User({
            username,
            email,
            password
        });

        user.save(function (err) {
            if (err) {
                return res.status(422).send({ errors: normalizeErrors(err.errors) });
            }

            res.json({ 'registered': true });
        });
    });
}