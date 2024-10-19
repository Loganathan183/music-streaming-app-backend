const express = require("express");
const router = express.Router();
const passport = require("passport")
const song = require("../models/song");
const user = require("../models/user");

router.post("/create", passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        // req.user gets the user because of passport authenticate
        const { name, thumbnail, track } = req.body;
        if (!name || !thumbnail || !track) {

            return res
                .status(301)
                .json({ err: "Insufficient details to create a song" });
        }
        const artist = req.user._id;
        const songdetails = { name, thumbnail, track, artist };
        const createdsong = await song.create(songdetails);
        return res.status(200).json(createdsong)
    })
router.get("/get/mysongs", passport.authenticate("jwt", { session: false }),
    async (req, res) => {

        //we need to get all songs where artistid==current._id
        const songs = await song.find({ artist: req.user._id }).populate("artist");
        return res.status(200).json({ data: songs });
    });

//get route to get all songs and artist has published
//i will send artist id and i want to see all songs that artist published
//get route to get single song by name
router.get("/get/artist/:artistId", passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { artistId } = req.params;

        const artist = await user.find({ _id: artistId })
        if (!artist) {
            return res.status(301).json({ err: "artist does not exist" })
        }

        const songs = await song.find({ artist: artistId });
        return res.status(200).json({ data: songs })
    })

    //get route to get single sog by name
router.get("/get/songname/:songname", passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { songname } = req.params;

        const songs = await song.find({ name: songname }).populate("artist");
        return res.status(200).json({ data: songs })
    })


module.exports = router;