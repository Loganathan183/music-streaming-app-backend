const express = require("express")
const router = express.Router();
const passport = require("passport")
const Playlist = require("../models/playlist");
const user = require("../models/user");
const song = require("../models/song");

//route1: create a playlist
router.post("/create", passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const currentuser = req.user;
        const [name, thumbnail, songs] = req.body;
        if (!name || !thumbnail || !songs) {
            return res.status(301).json({ err: "insuffcient data" })
        }
        const playlistData = {
            name,
            thumbnail,
            songs,
            owner: currentuser._id,
            collaborations: []
        }
        const playlist = await Playlist.create(playlistData)
        return res.status(200).json(playlist)

    })

//route2: get playlist by id
router.get("/get/playlist/:playlistid", passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const playlistId = req.user._id;
        const playlist = await Playlist.findOne({ _id: playlistId });
        if (!playlist) {
            return res.status(404).json({ err: "Invalid ID" })
        }
        return res.status(200).json(playlist)
    });

//get all playlist made by artist

//add a song to playlist
router.get("/get/artist/:artistid", passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const artistId = req.params.artistId;
        const artist = await user.findOne({ _id: artistId });
        if (!artist) {
            return res.status(304).json({ err: "Invalid artist ID" })
        }

        const songs = await Playlist.find({ owner: artistId });
        return res.status(200).json({ data: songs});
    });

router.post("/add/song", passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const currentuser = req.user;
        const { playlistId, songId } = req.body;

        const playlist = await Playlist.findOne({ _id: playlistId });
        if (!playlist) {
            return res.status(304).json({ err: "playlist does not exist" })
        }
console.log(playlist)
console.log(currentuser)
console.log(playlist.owner)
console.log(currentuser._id)
console.log(playlist._owner==currentuser._id)

        if (playlist.owner != currentuser._id && !playlist.collaboration.includes(currentuser._id)) {
            return res.status(400).json({ err: "not allowed" })
        }
        const Song = await song.findOne({ id: songId });
        if (!song) {
            return res.status(304).json({ err: "song does not exist" })
        }
        playlist.songs.push(songId);
        await playlist.save();
        return res.status(200).json(playlist)
    });

module.exports = router;