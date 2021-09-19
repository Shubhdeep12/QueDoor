exports.logoutUser = async (req, res, next) => {
  res.clearCookie("token");
  res.status(200).send({ success: true });
};
