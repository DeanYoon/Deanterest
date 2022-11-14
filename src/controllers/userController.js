import User from "../models/User";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
  const { email, username, password, password2, name, location } = req.body;
  const exists = await User.exists({
    $or: [{ username }, { name }, { email }],
  });

  if (password !== password2) {
    res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: "Password doesn't match",
    });
  }

  if (exists) {
    return res.render("join", {
      pageTitle: "Join",
      errorMessage: "This username/name/email is already taken",
    });
  }

  try {
    await User.create({
      email,
      username,
      password,
      location,
      name,
    });
  } catch (error) {
    return res.status(400).render("404", {
      pageTitle: "Error",
      errorMessage: error._message,
    });
  }
  return res.redirect("login");
};
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Delete User");
export const getLogin = (req, res) => {
  res.render("login", { pageTitle: "Login Page" });
};
export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";
  const user = await User.findOne({
    username,
  });

  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "This username doesn't exists",
    });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Wrong Password!",
    });
  }

  req.session.loggedIn = true;
  req.session.user = user;
  console.log(req.session);
  return res.redirect("/");
};
export const logout = (req, res) => res.send("Logout");
export const see = (req, res) => {
  console.log(req.params);
  res.send(req.params.id);
};
