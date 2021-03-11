const Post = require('../models/post');
const User = require('../models/user');
const Contributor = require('../models/contributor');
const Comment = require('../models/post-comment');
const Image = require('../models/image');

const { normalizeErrors } = require('../helpers/mongoose');
const paginate = require('express-paginate');

exports.createPost = (req, res) => {
    let {
        contributorName,
        contributorEmail,
        contributorCity,
        title,
        details,
        county,
        lat,
        lng,
        stories,
        previousFunctions,
        suggestedFunctions,
        isRecovered,
        images,
        newsletterAgree
    } = req.body;

    images = images.map(image => image.url);

    Contributor.findOne({ email: contributorEmail }, (err, foundContributor) => {
        if (err) {
            return res.status(422).send({ errors: normalizeErrors(err.errors) });
        }

        if (foundContributor) {
            foundContributor.name = contributorName;
            foundContributor.city = contributorCity;
            foundContributor.newsletterAgree = newsletterAgree;
        } else {
            foundContributor = new Contributor({ name: contributorName, email: contributorEmail, city: contributorCity, newsletterAgree });
        }

        Image.updateMany(
            { postUid: req.body.uid },
            { $set: { "isPostCreated": true } }
            , (err) => {
                if (err)
                    console.log(err);
            });

        foundContributor.save((err) => {
            if (err) {
                return res.status(422).send({ errors: normalizeErrors(err.errors) });
            }

            const newPost = new Post({ contributor: foundContributor, title, details, county, lat, lng, stories, previousFunctions, suggestedFunctions, isRecovered, images })

            Post.create(newPost, (err, createdPost) => {
                if (err) {
                    return res.status(422).send({ errors: normalizeErrors(err.errors) });
                }

                res.json(createdPost);
            });
        });
    });
};


exports.getPublicPosts = async (req, res) => {
    const { limit, page } = req.query;

    try {
        const [posts, itemCount] = await Promise.all([
            Post.find({ approved: true })
                .limit(limit)
                .skip(limit * (page - 1))
                .lean()
                .exec(),

            Post.countDocuments({ approved: true })
        ]);

        const pageCount = Math.ceil(itemCount / limit);

        res.json({
            hasMore: paginate.hasNextPages(req)(pageCount),
            pageCount,
            itemCount,
            currentPage: page,
            pages: paginate.getArrayPages(req)(10, pageCount, (page - 1)),
            posts
        });
    } catch (err) {
        return res.status(422).send({ errors: normalizeErrors(err.errors) });
    }
};

exports.getAllPosts = async (req, res) => {
    const { limit, page } = req.query;

    try {
        const [posts, itemCount] = await Promise.all([
            Post.find({})
                .limit(limit)
                .skip(limit * (page - 1))
                .lean()
                .exec(),

            Post.countDocuments({})
        ]);

        const pageCount = Math.ceil(itemCount / limit);

        res.json({
            hasMore: paginate.hasNextPages(req)(pageCount),
            pageCount,
            itemCount,
            currentPage: page,
            pages: paginate.getArrayPages(req)(10, pageCount, (page - 1)),
            posts
        });
    } catch (err) {
        return res.status(422).send({ errors: normalizeErrors(err.errors) });
    }
};

exports.getPostDetails = (req, res) => {
    const postId = req.params.id;

    Post.findById(postId)
        .select('-__v -approved -approvedAt -contributor')
        .populate({
            path: 'comments',
            model: 'PostComment',
            select: '_id comment likes createdAt',
            match: { approved: { $eq: true } },
            options: { sort: { 'createdAt': -1 } }
        })
        .exec((err, post) => {
            if (err) {
                return res.status(422).send({ errors: normalizeErrors(err.errors) });
            }

            if (!post) {
                return res.status(422).send({ errors: [{ title: 'Invalid Post ID!', detail: 'Post does not exist.' }] });
            }

            res.json(post);
        });
};

exports.editPostDetails = (req, res) => {
    const postData = req.body;
    const postId = req.params.id;

    Post.findById(postId)
        .exec((err, post) => {
            if (err) {
                return res.status(422).send({ errors: normalizeErrors(err.errors) });
            }

            if (!post) {
                return res.status(422).send({ errors: [{ title: 'Invalid Post ID!', detail: 'Post does not exist.' }] });
            }

            post.set(postData);
            post.save(function (err) {
                if (err) {
                    return res.status(422).send({ errors: normalizeErrors(err.errors) });
                }

                return res.status(200).send(post);
            });
        });
};

exports.getFilteredPosts = (req, res) => {
    const { counties, orderBy, orderType, searchString } = req.body;

    if (!(counties || (orderBy && orderType) || searchString)) {
        return res.status(422).send({ errors: [{ title: "Data missing", detail: "Provide filters" }] });
    }

    if (!["asc", "desc"].includes(orderType.toLowerCase())) {
        return res.status(422).send({ errors: [{ title: "Data missing", detail: "Order type must be 'asc' or 'desc'" }] });
    }

    if (!["date", "location", "likes"].includes(orderBy.toLowerCase())) {
        return res.status(422).send({ errors: [{ title: "Data missing", detail: "Sorting must be one of 'date', 'likes' or 'location'" }] });
    }

    let posts = [];

    db.collection('lost-heritage').orderBy(orderBy.toLowerCase(), orderType.toLowerCase()).get().then((snapshot) => {
        snapshot.forEach((doc) => {
            posts.push(doc.data());
        })
        res.send(posts);
    })
};

exports.likePost = (req, res) => {
    const postId = req.params.id;

    if (!postId) {
        return res.status(422).send({ errors: [{ title: "Data missing", detail: "Provide Post ID" }] });
    }

    Post.findByIdAndUpdate(postId, { $inc: { 'likes': 1 } }, (err, post) => {
        if (err) {
            return res.status(422).send({ errors: normalizeErrors(err.errors) });
        }

        if (!post) {
            return res.status(422).send({ errors: [{ title: 'Invalid Post ID!', detail: 'Post does not exist.' }] });
        }

        post.likes++;
        res.json(post);
    });
};

exports.commentPost = async (req, res) => {
    const postId = req.params.id;
    const { comment } = req.body;

    if (!postId || !comment) {
        return res.status(422).send({ errors: [{ title: "Data missing", detail: "Provide Post ID and Comment" }] });
    }

    const commentObj = new Comment({ comment });
    const newComment = await Comment.create(commentObj);

    if (!newComment) {
        return res.status(422).send({ errors: [{ title: "Error", detail: "Error creating comment." }] });
    }

    Post.findByIdAndUpdate(postId, { $push: { 'comments': newComment } }, (err, post) => {
        if (err) {
            return res.status(422).send({ errors: normalizeErrors(err.errors) });
        }

        if (!post) {
            return res.status(422).send({ errors: [{ title: 'Invalid Post ID!', detail: 'Post does not exist.' }] });
        }

        newComment.set({ post });
        newComment.save();

        post.comments.push(newComment);
        res.json(post);
    });
};

exports.approvePost = (req, res) => {
    const postId = req.params.id;
    const user = res.locals.user;

    if (!postId) {
        return res.status(422).send({ errors: [{ title: "Data missing", detail: "Provide Post ID" }] });
    }

    User.findById(user.id, function (err, foundUser) {
        if (err) {
            return res.status(422).send({ errors: normalizeErrors(err.errors) });
        }

        Post.findByIdAndUpdate(postId, { $set: { 'approved': true, 'approvedBy': foundUser, 'approvedAt': Date.now(), 'declined': false } }, (err, post) => {
            if (err) {
                return res.status(422).send({ errors: normalizeErrors(err.errors) });
            }

            if (!post) {
                return res.status(422).send({ errors: [{ title: 'Invalid Post ID!', detail: 'Post does not exist.' }] });
            }

            post.approvedBy = foundUser;
            post.approved = true;
            post.approvedAt = Date.now;
            post.declined = false;
            res.json(post);
        });
    });
}

exports.declinePost = (req, res) => {
    const postId = req.params.id;
    const user = res.locals.user;

    if (!postId) {
        return res.status(422).send({ errors: [{ title: "Data missing", detail: "Provide Post ID" }] });
    }

    User.findById(user.id, function (err, foundUser) {
        if (err) {
            return res.status(422).send({ errors: normalizeErrors(err.errors) });
        }

        Post.findByIdAndUpdate(postId, { $set: { 'declined': true, 'declinedBy': foundUser, 'declinedAt': Date.now(), 'approved': false } }, (err, post) => {
            if (err) {
                return res.status(422).send({ errors: normalizeErrors(err.errors) });
            }

            if (!post) {
                return res.status(422).send({ errors: [{ title: 'Invalid Post ID!', detail: 'Post does not exist.' }] });
            }

            post.declinedBy = foundUser;
            post.declined = true;
            post.declinedAt = Date.now;
            post.approved = false;
            res.json(post);
        });
    });
}

exports.filterPosts = (req, res) => {
    const { countyList, sortBy, sortType } = req.body;

    if (!countyList && !sortBy && !sortType) {
        return res.status(422).send({ errors: [{ title: 'Data missing', detail: 'Provide countyList, sortBy and/or sortType.' }] });
    }

    let dbQuery = Post.find({ 'county': { $in: countyList } });

    if (sortBy || sortType) {
        const sort = {};
        sortType = 'date';
        sort[sortBy] = (sortType |= -1);
        dbQuery.sort(sort)
    }

    dbQuery.exec((err, posts) => {
        if (err) {
            return res.status(422).send({ errors: normalizeErrors(err.errors) });
        }

        if (!posts) {
            return res.status(422).send({ errors: [{ title: 'Invalid Post ID!', detail: 'Post does not exist.' }] });
        }

        res.send(posts)
    });
};

exports.searchPosts = (req, res) => {
    const { query, sortBy, sortType } = req.query;

    let dbQuery = Post.find({ $text: { $search: query } });

    if (!query) {
        return res.status(422).send({ errors: [{ title: "Data missing", detail: "Provide search query." }] });
    }

    if (sortBy && sortType) {
        const sort = {};
        sort[sortBy] = sortType;

        dbQuery.sort(sort)
    }

    dbQuery.exec((err, posts) => {
        if (err) {
            return res.status(422).send({ errors: normalizeErrors(err.errors) });
        }

        if (!posts) {
            return res.status(422).send({ errors: [{ title: 'Invalid Post ID!', detail: 'Post does not exist.' }] });
        }

        res.send(posts)
    });
};

exports.getApprovedPosts = (req, res) => {
    Post.find({ approved: true })
        .populate('approvedBy')
        .exec((err, posts) => {
            if (err) {
                return res.status(422).send({ errors: normalizeErrors(err.errors) });
            }

            if (!posts) {
                return res.json([]);
            }

            res.send(posts)
        });
}

exports.getPendingPosts = (req, res) => {
    Post.find({ 'approved': false, 'declined': false })
        .exec((err, posts) => {
            if (err) {
                return res.status(422).send({ errors: normalizeErrors(err.errors) });
            }

            if (!posts) {
                return res.json([]);
            }

            res.send(posts)
        });
}

exports.getDeclinedPosts = (req, res) => {
    Post.find({ 'approved': false, 'declined': true })
        .populate('declinedBy')
        .exec((err, posts) => {
            if (err) {
                return res.status(422).send({ errors: normalizeErrors(err.errors) });
            }

            if (!posts) {
                return res.json([]);
            }

            res.send(posts)
        });
}
