const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var _ = require("underscore");

exports.signup = (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    posts: [],
    comments: [],
  });

  user.save((err, user) => {
    if (err) {
      console.log(err);
      res.status(500).send({ message: err });
      return;
    }
    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles },
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map((role) => role._id);
          user.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            var token = jwt.sign({ id: user.id }, process.env.secret, {
              expiresIn: 86400, // 24 hours
            });
            res
              .status(200)
              .cookie("token", token, { httpOnly: true })
              .send({
                values: _.pick(user, ["id", "name"]),
                message: "signup successfull",
              });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          var token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 86400, // 24 hours
          });
          //console.log(_.pick(user, ["id", "name"]));
          res
            .status(200)
            .cookie("token", token, { httpOnly: true })
            .send({
              values: _.pick(user, ["id", "name"]),
              message: "signup successfull",
            });
        });
      });
    }
  });
};

exports.signin = (req, res) => {
  User.findOne({
    email: req.body.email,
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: "a" + err });
        return;
      }

      if (!user) {
        return res.status(500).send({ message: err });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(500).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      const values = {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: authorities,
      };
      res
        .status(200)
        .cookie("token", token, { httpOnly: true })
        .send({
          values: _.pick(values, ["id", "name"]),
          message: "signin successfull",
        });
    });
};
