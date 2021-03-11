const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const contributorSchema = new Schema({
    name: {
        type: String,
        required: true,
        max: [128, "Title too long. Max: 128 characters."]
    },
    email: {
        type: String,
        max: [32, "Name too long. Max: 32 characters."],
        min: [4, "Name too short. Min: 4 characters."],
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address']
    },
    city: {
        type: String,
        required: true,
        max: [30, "City too long. Max: 30 characters."]
    },
    newsletterAgree: {
        type: Boolean,
        default: false
    }
});


module.exports = mongoose.model("Contributor", contributorSchema);