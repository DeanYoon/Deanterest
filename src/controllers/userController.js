import User from "../models/User";

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

  await User.create({
    email,
    username,
    password,
    location,
    name,
  });
  return res.redirect("login");
};
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Delete User");
export const login = (req, res) => res.send("Login");
export const logout = (req, res) => res.send("Logout");
export const see = (req, res) => {
  console.log(req.params);
  res.send(req.params.id);
};
