const User = require("../models/UserSchema");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
//2 power 10 rounds of encryption  
var jwt = require("jsonwebtoken");
let jwtSecret = process.env.jwtSecret;
let randomstring = require('randomstring')
const nodemailer = require('nodemailer')
require('dotenv').config()
// const path = require('path')

const registerUser = async (req, res) => {
  //let name = req.body.name
  //let email = req.body.email
  let { name, email, password, address } = req.body;
  try {
    let registeredUser = await User.findOne({ email });
    if (registeredUser) {
      return res.json({ msg: "User already exists", success: false });
    } else {
      let hashedPassword = await bcrypt.hashSync(password, salt);
      //encrypted form
      let data = await User.create({
        name,
        email,
        password: hashedPassword,
        address,
      });
      res.json({ msg: "User created successfully", success: true, data });
    }
  } catch (error) {
    res.json({
      msg: "Error in registering user",
      error: error.message,
      success: false,
    });
  }
};
const loginUser = async (req, res) => {
  let { email, password } = req.body;
  try {
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      let validPassword = bcrypt.compareSync(password, existingUser.password);
      //encoded form 
      if (validPassword) {
        var token = jwt.sign({ _id: existingUser._id }, jwtSecret);
        res.json({ msg: "Login Successful", success: true, user: token });
      } else {
        res.json({ msg: "Invalid Password", success: false });
      }
    } else {
      res.json({ msg: "User not found", success: false });
    }
  } catch (error) {
    res.json({ msg: "Error in Login", error: error.message, success: false });
  }
};
const updateUser = async (req, res) => {
  let _id = req.params._id
  let id = req.user
  // console.log(_id, id)
  let { name, password, address, profilePic, coverPic, bio } = req.body
  try {
    if (id === _id) {
      let hashedPassword;
      if (password) {
        hashedPassword = bcrypt.hashSync(password, salt)
      }
      let data = await User.findByIdAndUpdate(id, { $set: { name, password: hashedPassword, address, profilePic, coverPic, bio } }, { new: true })
      return res.json({ msg: 'User data updated!', success: true, data })
    }
    else {
      return res.json({ msg: 'User Verification Failed, you can only update your details!' })
    }
  } catch (error) {
    return res.json({ msg: 'Error updating data', success: false, error: error.message })
  }
};
const deleteUser = async (req, res) => {
  let _id = req.params._id;
  let id = req.user;
  try {
    if (_id != id) {
      return res.json({
        msg: "You can only delete your own account",
        success: false,
      });
    } else {
      await User.findByIdAndDelete(id);
      return res.json({ msg: "Account deleted successfully", success: true });
    }
  } catch (error) {
    return res.json({
      msg: "Error in deleting account",
      error: error.message,
      success: false,
    });
  }
};

const getUserDetails = async (req, res) => {
  try {
    let id = req.user
    let userDetails = await User.findById(id).select('-password')
    res.json({ msg: 'User Details fetched succesfully!', success: true, userDetails })
  } catch (error) {
    res.json({ msg: 'Error in retrieving user details', success: false, error: error.message })
  }
}

let forgotPassword = async (req, res) => {
  try {
    let { email } = req.body
    let user = await User.findOne({ email })
    // console.log(user)
    if (user) {
      // let resetToken = await crypto.randomBytes(64).toString('hex')
      let resetToken = await randomstring.generate(18)
      // console.log(resetToken)
      // method-1
      user.resetToken = resetToken
      await user.save()
      // method2
      // await User.findByIdAndUpdate(id, { $set: { resetToken } }, { new: true })
      let datasend = sendMail(email, resetToken)
      res.json({ msg: "Token generated successfully!", success: true, resetToken })
    }
    else {
      return res.json({ msg: 'User not found!', success: false })
    }
  } catch (error) {
    return res.json({ msg: 'Error!', success: false, error: error.message })
  }
}


async function sendMail(email, resetToken) {
  // console.log("mail=", email)
  // console.log("token=", resetToken)


  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.NODE_MAILER_EMAIL,
      pass: process.env.NODE_MAILER_PASSWORD
    }
  })

  const info = await transporter.sendMail({
    from: 'epicdward@gmail.com', // sender address
    to: email, // list of receivers
    subject: "Reset Password Request", // Subject line
    text: `This is your reset password link http://localhost:3000/users/resetToken/${resetToken}`, // plain text body
    html: `This is your reset password link http://localhost:3000/users/resetToken/${resetToken}`, // html body
  });
  console.log("Message sent %s", info.messageId)
}

// let rasta = path.join(__dirname, '../index.html')
// console.log(rasta)

const getTokenMail = async (req, res) => {
  let token = req.params.token
  // console.log(token)

  let user = await User.findOne({ resetToken: token })
  // console.log(user)
  
  if (user) {
    res.render('newPassword', { token })
  }
  else {
    res.send('<h1>Token not found</h1>')
  }
}

const finalResetPassword = async (req, res) => {
  let token = req.params.token
  let newPassword = req.body.password

  // console.log('token', token)
  // console.log('pwd', newPassword)

  let user = await User.findOne({ resetToken: token })
  if (user) {
    let hashedPassword = await bcrypt.hashSync(newPassword, salt)
    user.password = hashedPassword
    user.resetToken = null
    await user.save()
    res.json({ msg: 'Password updated successfully!', success: true })
  }
  else {
    res.json({ msg: 'Token expired', success: false })
  }
}

const searchUser = async (req, res) => {
  let { name } = req.query
  // console.log(name)
  try {
    if (name && name.length > 0) {
      let regex = new RegExp(name, 'i')
      let user = await User.find({ name: regex }).populate({ path: 'followers', select: '-password' }).populate({ path: 'followings', select: '-password' })
      // console.log(user)
      res.json({ msg: 'User Details fetched succesfully!', success: true, user })
    }
    else {
      res.json({ msg: 'Query not found!' })
    }
  } catch (error) {
    // console.log(error)
    return res.json({ msg: 'Error!', success: false, error: error.message })
  }
}

const getUserById = async (req, res) => {
  let userId = req.params.userId
  // console.log(userId)
  try {
    let user = await User.findById(userId).select('-password')
    res.json({ msg: 'User Details fetched succesfully!', success: true, user })
  } catch (error) {
    res.json({ msg: 'Error in retrieving user details', success: false, error: error.message })
  }
}

const followUser = async (req, res) => {
  let userId = req.user
  let friendId = req.params.friendId

  let user = await User.findById(userId)
  let friend = await User.findById(friendId)
  try {
    if(user.followings.includes(friend._id) && friend.followers.includes(user._id)){
      user.followings.pull(friend._id)
      friend.followers.pull(user._id)

      await user.save()
      await friend.save()
      return res.json({ msg: 'User unfollowed successfully', success: true })
    }
    else{
      user.followings.push(friend._id)
      friend.followers.push(user._id)
      await user.save()
      await friend.save()

      return res.json({ msg: 'User followed successfully', success: true })
    }
  } catch (error) {
    res.json({ msg: 'Error in following user', success: false, error: error.message })
  }
}

module.exports = {
  register: registerUser,
  loginUser,
  updateUser,
  deleteUser,
  getUserDetails,
  forgotPassword,
  getTokenMail,
  finalResetPassword,
  searchUser,
  getUserById,
  followUser
};
