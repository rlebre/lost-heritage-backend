const User = require('../models/user');
const { normalizeErrors } = require('../helpers/mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config');

exports.authMiddleware = function (req, res, next) {
    const token = req.headers.authorization;

    if (token) {
        const user = parseToken(token);

        if (user) {
            User.findById(user.userId, function (err, user) {
                if (err) {
                    return res.status(422).send({ errors: normalizeErrors(err.errors) });
                }

                if (user) {
                    res.locals.user = user;
                    next();
                } else {
                    return notAuthorized(res);
                }
            });
        } else {
            return notAuthorized(res);
        }
    } else {
        return notAuthorized(res);
    }
}

function parseToken(token) {
    try {
        return jwt.verify(token.split(' ')[1], config.JWT_SECRET);
    } catch (err) {
        return null;
    }
}

function notAuthorized(res) {
    return res.status(401).send({ errors: [{ title: "Not authorized.", detail: "You need to login" }] });
}