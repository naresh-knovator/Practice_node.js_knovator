const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    // console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const uploadSingle = multer({ storage: storage }).single("avatar");
const uploadMultiple = multer({ storage: storage }).array("files",12);

module.exports = {
  uploadSingle,
  uploadMultiple,
};
