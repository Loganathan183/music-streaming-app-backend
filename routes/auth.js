const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt")
const { getToken } = require("../utils/helpers");
const User = require("../models/user")




//this post route will help the regsiter a user

    // this code is run when the register api is called as post request
    //my req.body will be format{email,password,firstname,lastname,username}


    //step2: does a user with this email already exists?if yes we throw an error

    
        //status code by default is 200

   
    //this is valid request
    router.post("/register", async (req, res) => {
        try {
            const { email, password, firstname, lastname, username } = req.body;
    
            const user = await User.findOne({ email: email });
            if (user) {
                return res.status(403).json({ error: "A user with this email already exists" });
            }
    
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUserData = {
                email,
                password: hashedPassword,
                firstname,
                lastname,
                username
            };
            const newUser = await User.create(newUserData);
    
            const token = await getToken(email, newUser);
            const userToReturn = { ...newUser.toJSON(), token };
            delete userToReturn.password;
    
            return res.status(200).json(userToReturn);
        } catch (err) {
            return res.status(500).json({ error: "Server error" });
        }
    });
    


    //step3:create a new user in db
    //step3.1 we dont store password in plain text
    //we convert the plain text password to hash


    //step4:we want to create a token to return the use

    // step5:return the result to the user


router.post("/login", async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({ email: email })
    if (!user) {
        return res.status(403).json({ err: "invalid credentials" })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(403).json({ err: "invalid credentials" })
    }
    const token = await getToken(user.email, user)
    const userToReturn = { ...user.toJSON(), token };
    delete userToReturn.password;
    return res.status(200).json(userToReturn)
});


module.exports = router;


