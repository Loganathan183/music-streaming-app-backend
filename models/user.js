const mongoose = require("mongoose");

const user = new mongoose.Schema ({
    firstname: {
        type: String,
        required: true,
    },
    password:{
        type:String,
        required:true,
        private:"true",
    },
    lastname: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    likedsongs: {
        type: String,
        default: "",
    },
    likedplaylist: {
        type: String,
        default: ""
    }, subscribedArtists: {
        type: String,
        default: "",
    }
})

const UserModel = mongoose.model("user", user)
module.exports = UserModel;