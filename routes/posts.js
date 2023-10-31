const express = require("express");
const multer = require("multer");

const {
  post,
  getPosts,
  updatePost,
  deletePost,
} = require("../controllers/posts.js");

const route = express.Router();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({ storage: fileStorage, fileFilter: fileFilter });

route.post("/post", upload.single("image"), post);
route.get("/get", getPosts);
route.post("/update", upload.single("image"), updatePost);
route.get("/delete/:id", deletePost);

module.exports = route;
