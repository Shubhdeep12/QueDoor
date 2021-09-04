const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const path = require("path");
const cloudinary = require("cloudinary").v2;
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "quedoor",
    // format: async () => "png",
    public_id: (req, file) => req.body.name,
  },
});
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
  let ext = path.extname(file.originalname);
  if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
    cb(new Error("File type is not supported"), false);
    return;
  }
  cb(null, true);
};
const multerUploads = multer({ storage, fileFilter }).single("image");

module.exports = { multerUploads };
