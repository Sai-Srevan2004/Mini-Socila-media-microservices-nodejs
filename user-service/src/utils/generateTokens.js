const jwt = require('jsonwebtoken')
require('dotenv').config()
const RefreshToken = require('../models/RefreshToken')
const crypto=require('crypto')

const generateTokens =async (user) => {

    const accessToken = jwt.sign(
        {
            userId: user._id,
            email: user.email
        }
        , process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
    )

    const token = crypto.randomBytes(64).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    //Store the refresh token in MongoDB
    const newToken = await RefreshToken.create({
        token,
        user:user._id,
        expiresAt,
    });

    return { accessToken, refreshToken:newToken.token }

}


module.exports = generateTokens