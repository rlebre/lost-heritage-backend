const rateLimit = require("express-rate-limit");

module.exports = {
    likeLimiter: rateLimit({
        windowMs: 24 * 60 * 60 * 1000, // 1 day block
        max: 10, // start blocking after 5 requests
        skipFailedRequests: true,
        keyGenerator: function (req, res) {
            return `${req.ip}-${req.params.id}`;
        },
        message: {
            errors: [{
                title: "Too many requests",
                message: "Too many likes from this IP, please try again later."
            }]
        }
    }),

    createPostLimiter: rateLimit({
        windowMs: 10 * 60 * 1000, // 10 minutes block
        max: 5, // start blocking after 5 requests
        skipFailedRequests: true,
        message: {
            errors: [{
                title: "Too many requests",
                message: "Too many create post from this IP, please try again later."
            }]
        }
    }),

    commentLimiter: rateLimit({
        windowMs: 24 * 60 * 60 * 1000, // 1 day block
        max: 3, // start blocking after 3 requests
        skipFailedRequests: true,
        message: {
            errors: [{
                title: "Too many requests",
                message: "Too many comments from this IP, please try again later."
            }]
        }
    })
}