//hàm kiểm tra người dùng đã đăng nhập chưa
const isAuth = (req, res, next) => {
  try {
    if (!req.session.loggedIn) {
      res.redirect(`${process.env.CLIENT_APP}/login`);
    } else {
      next();
    }
  } catch (err) {
    return res.redirect(`${process.env.CLIENT_APP}/server-error`);
  }
};

module.exports = isAuth;
