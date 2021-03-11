const express = require("express");
const router = express.Router();
const User = require("../controllers/user");

router.get('/:id', User.getUser);
router.post("/login", User.auth);
router.post("/register", User.register);

module.exports = router;
