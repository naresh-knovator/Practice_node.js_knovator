const express = require("express");
const route = express.Router();
const {
  createUser,
  loginUser,
  deleteUser,
  updateUser,
  sendMailer,
  getAllUser,
  createAlbumOfUser,
  createAlbumOfUserwithParams,
  getAllAlbum,
  getUserAlbum,
  albumPhotos,
  getAllAlbumPhotos,
  getAllUserAgg,
  barcodeGenerater,
  shortenerUrl
} = require("../controller/userController");
const authMiddleWare = require("../middleware/authMiddleware");
const { uploadSingle } = require("../middleware/fileUploaded");

route.post("/", createUser);
route.post("/login", loginUser);
route.put("/:id", authMiddleWare, updateUser);
route.post("/mail", authMiddleWare, sendMailer);
route.delete("/:id", authMiddleWare, deleteUser);
route.get("/all-users", authMiddleWare, getAllUser);
route.get("/all-users/agg", authMiddleWare, getAllUserAgg);
route.post("/album", authMiddleWare, createAlbumOfUser);
route.post("/album/:userId", authMiddleWare, createAlbumOfUserwithParams);
route.get("/album", authMiddleWare, getAllAlbum);
route.post("/user-album/:userId", authMiddleWare, getUserAlbum);
route.post(
  "/user-albumImage/:albumId",
  uploadSingle,
  authMiddleWare,
  albumPhotos
);
route.get("/user-albumImage", authMiddleWare, getAllAlbumPhotos);
route.post("/barcode", authMiddleWare, barcodeGenerater);
route.post("/shortener", authMiddleWare, shortenerUrl);

module.exports = route;
