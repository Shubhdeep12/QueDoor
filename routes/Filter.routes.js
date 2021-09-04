//this page will help user to search for the particular quwestion
// either by image
//or by text+image
//or by text
//result the almost same posts

const express = require("express");
const app = express();
const router = express.Router();
const controller = require("../controllers/filter.controller");
const cors = require("cors");

app.use(cors());

router.route("/").post(async (req, res) => {
  controller.filter(req, res);
});

module.exports = router;
