const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

// const SessionModel = require("../models/Session.js");
const UsersModel = require("../models/User.js");

//hàm xử lý việc đăng ký
const signup = async (req, res) => {
  try {
    const errors = validationResult(req);
    const err = [];
    errors.array().forEach((error) => {
      err.push({ msg: error.msg, path: error.path });
    });
    // console.log(err);
    if (!errors.isEmpty()) {
      return res.status(400).json({ err: err });
    } else {
      const existingUser = await UsersModel.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(409).json({ err: [], message: "Existing user!" });
      } else {
        const newUser = new UsersModel({
          email: req.body.email,
          pass: bcrypt.hashSync(req.body.pass, 8),
          name: req.body.name,
        });
        await newUser.save();
        return res.status(201).json({ err: [], message: "Created!" });
      }
    }
  } catch (err) {
    return res.redirect(`${process.env.CLIENT_APP}/server-error`);
  }
};
//hàm xử lý việc đăng nhập
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    const err = [];
    errors.array().forEach((error) => {
      err.push({ msg: error.msg, path: error.path });
    });
    if (!errors.isEmpty()) {
      return res.status(400).json({ err: err });
    } else {
      const existingUser = await UsersModel.findOne({ email: req.body.email });
      if (existingUser) {
        const correctPass = bcrypt.compareSync(
          req.body.pass,
          existingUser.pass
        );
        if (correctPass) {
          req.session.loggedIn = true;
          existingUser.pass = undefined;
          req.session.user = existingUser;
          return res
            .status(200)
            .json({ err: [], message: "You are logged in!" });
        } else {
          return res
            .status(400)
            .json({ err: [], message: "Wrong email or password" });
        }
      } else {
        return res
          .status(400)
          .json({ err: [], message: "Wrong email or password" });
      }
    }
  } catch (err) {
    return res.redirect(`${process.env.CLIENT_APP}/server-error`);
  }
};
//hàm kiểm tra người dùng đã đăng nhập chưa
const checkLogin = (req, res) => {
  try {
    if (!req.session.loggedIn) {
      res.status(200).json({ message: "have not been logged in yet" });
    } else {
      res.status(200).json({ message: "You are logged in" });
    }
  } catch (err) {
    return res.redirect(`${process.env.CLIENT_APP}/server-error`);
  }
};
//hàm xử lý việc đăng xuất
const logout = (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return res.redirect(`${process.env.CLIENT_APP}/server-error`);
      } else {
        res.clearCookie("connect.sid");
        return res.status(200).json({ message: "You are logged out!" });
      }
    });
  } catch (err) {
    return res.redirect(`${process.env.CLIENT_APP}/server-error`);
  }
};
module.exports = { signup, login, checkLogin, logout };
