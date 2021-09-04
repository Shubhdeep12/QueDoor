const express = require("express");
const router = express.Router();
const cors = require("cors");
const mongoose = require("mongoose");
const Login = require("./routes/Login.routes");
const Home = require("./routes/Home.routes");
const Filter = require("./routes/Filter.routes");
const Account = require("./routes/Account.routes");
const db = require("./models");
const Role = db.role;
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();
const { multerUploads } = require("./middlewares/multer");
const { uploader, cloudinaryConfig } = require("./config/cloudinary.config");
const path = require("path");
//middleware
app.use(cors());
app.use("*", cloudinaryConfig);
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/images", express.static(path.join(__dirname, "/images")));
//Setting up port
const port = process.env.PORT || 4000;

//Setting up database connection
const uri = process.env.ATLAS_URI;
try {
  db.mongoose.connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });

  console.log("Mongo db connected successfully");
  initial();
} catch (err) {}

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("mongodb database connection established successfully");
});

//Routes
app.use("/Login", Login);
app.use("/Home", Home);
app.use("/Account", Account);
app.use("/Filter", Filter);

//Setting up image storage

//For locally

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "images");
//   },
//   filename: function (req, file, cb) {
//     cb(null, req.body.name);
//   },
// });

//For storing in cloud

// let upload = multer({ storage, fileFilter });

app.route("/upload").post(multerUploads, (req, res) => {
  try {
    if (req.file.path) {
      res.status(200).send({
        name: req.file.path,
        public_id: "quedoor/" + path.parse(req.file.path).name,
      });
    } else {
      throw Error();
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
