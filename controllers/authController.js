const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {generateAccessToken, generateRefreshToken} = require("../utils/generateTokens");
const register = async (req,res)=>{
    try{

        const {name,email,password} = req.body;

        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                message:"User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user = await User.create({
            name,
            email,
            password:hashedPassword
        });

        res.status(201).json({
            message:"User registered successfully"
        });

    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const accessToken = generateAccessToken(
      user._id,
      user.role
    );

    const refreshToken = generateRefreshToken(
      user._id
    );

    user.refreshToken = refreshToken;

    await user.save();

    res.status(200).json({
      accessToken,
      refreshToken,
      role: user.role
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};
const refreshAccessToken = async (req, res) => {
  try {

    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token required"
      });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (user.refreshToken !== refreshToken) {
      return res.status(403).json({
        message: "Invalid refresh token"
      });
    }

    const accessToken = generateAccessToken(
      user._id,
      user.role
    );

    res.status(200).json({
      accessToken
    });

  } catch (error) {

    res.status(403).json({
      message: "Invalid or expired refresh token"
    });

  }
};
const logout = async (req, res) => {
  try {

    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        message: "Refresh token required"
      });
    }

    const user = await User.findOne({ refreshToken });

    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    res.status(200).json({
      message: "Logged out successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

module.exports = {
    register,
    login,
    refreshAccessToken,
    logout
};