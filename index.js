const express = require("express")
require("dotenv").config();
const mongoose = require("mongoose")
const user = require("./models/user")

const authRoutes = require("./routes/auth")
const songRoutes = require("./routes/song")
const playlistRoutes = require("./routes/playlist")
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require("passport");
const app = express();
const cors = require("cors")
const port = 8050

app.use(express.json());
app.use(cors());

//connect to mongodb 
mongoose.connect("mongodb+srv://viratlogu183:" + process.env.mONGO_password + "@cluster0.gr5ss.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then((x) => {
    console.log("connected to mongodb successfully")
})
    .catch((err) => {
        console.log("error while connecting to mongodb")
    })
let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "thisKeyIsSupposedToBeSecret";

passport.use(new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
        const foundUser = await user.findOne({ _id: jwt_payload.identifier }); // Use await here

        if (foundUser) {
            return done(null, foundUser);
        } else {
            return done(null, false); // No user found
        }
    } catch (err) {
        return done(err, false); // Handle error
    }
}));

// or you could create a new account




app.get('/', (req, res) => (
    res.send("hello world")
))

app.use("/auth", authRoutes);
app.use("/song", songRoutes);
app.use("/playlist", playlistRoutes)

app.listen(port, () => {
    console.log("app is running in port" + port)
})