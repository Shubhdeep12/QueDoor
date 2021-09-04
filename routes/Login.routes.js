const express = require("express");
const router = express.Router();
const app = express();
const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");
require("dotenv").config();
app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept",
    "Access-Control-Allow-Origin"
  );
  next();
});

router
  .route("/signup")
  .post(
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    async (req, res) => {
      controller.signup(req, res);
    }
  );

router.route("/signin").post(async (req, res) => {
  controller.signin(req, res);
});

module.exports = router;
