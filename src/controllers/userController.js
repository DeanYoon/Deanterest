import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";
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
export const getEdit = (req, res) => {
  return res.render("edit-profile", { pageTitle: "Edit Profile" });
};
export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { name, email, username, location },
  } = req;

  const userExists = await User.exists({
    $and: [{ $or: [{ username }, { email }] }, { _id: { $ne: _id } }],
  });
  if (userExists) {
    return res.render("edit-profile", {
      pageTitle: "Edit Profile",
      errorMessage: "username or email already exists",
    });
  }

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      name,
      email,
      username,
      location,
    },
    {
      new: true,
    }
  );

  req.session.user = updatedUser;

  return res.redirect("/users/edit");
};
export const getLogin = (req, res) => {
  res.render("login", { pageTitle: "Login Page" });
};
export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";
  const user = await User.findOne({
    username,
    socialOnly: false,
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
export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};
export const see = (req, res) => {
  console.log(req.params);
  res.send(req.params.id);
};

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GITHUB_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GITHUB_CLIENT,
    client_secret: process.env.GITHUB_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;

  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();

  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();

    const emailObject = emailData.find(
      (email) => email.primary === true && email.verified === true
    );

    if (!emailObject) {
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: emailObject.email });
    if (!user) {
      user = await User.create({
        avatarUrl: userData.avatar_url,
        email: emailObject.email,
        username: userData.login,
        password: "",
        location: userData.location,
        sicialOnly: true,
        name: userData.name,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};
