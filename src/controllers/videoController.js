import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";
import res from "express/lib/response";
import { async } from "regenerator-runtime";
export const home = async (req, res) => {
  try {
    const videos = await Video.find({})
      .sort({ createdAt: "desc" })
      .populate("owner");

    return res.render("home", { pageTitle: "Home", videos });
  } catch {
    return res.render("404");
  }
};

export const watch = async (req, res) => {
  const id = req.params.id;
  const video = await Video.findById(id)
    .populate("owner")
    .populate("comments")
    .populate("owner");
  const comments = await Comment.find({ video: id }).populate("owner");

  if (!video) {
    return res.status(400).render("404", { pageTitle: "Video Not Found." });
  }
  return res.render("watch", { pageTitle: video.title, video, comments });
};

export const getEdit = async (req, res) => {
  const id = req.params.id;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }

  if (String(video.owner) !== _id) {
    req.flash("error", "Not authorized");
    return res.status(403).redirect("/");
  }
  res.render("edit", { pageTitle: `Editing `, video });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById({ _id: id }); // boolean value
  if (!video) {
    return res.render("404", { pageTitle: "Video Not Found." });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "Not authorized");

    return res.status(403).redirect("/");
  }

  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;

  const { video, thumb } = req.files;
  const { title, description, hashtags } = req.body;
  try {
    const newVideo = await Video.create({
      title,
      description,
      owner: _id,
      createdAt: Date.now(),
      fileUrl: video[0].path,
      thumbUrl: thumb[0].path,
      hashtags: Video.formatHashtags(hashtags),
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    await user.save();
    return res.redirect("/");
  } catch (error) {
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  const user = await User.findById(_id);

  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }
  if (String(video.owner) !== _id) {
    req.flash("error", "Not authorized");

    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  user.videos = user.videos.filter((video) => String(video) !== id);
  await user.save();
  res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    }).populate("owner");
  }

  return res.render("search", { pageTitle: "Search", videos });
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
};

export const createComment = async (req, res) => {
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;

  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });
  video.comments.push(comment._id);
  await video.save();
  return res.status(201).json({ newCommentId: comment._id, owner: user });
};

export const deleteComment = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const comment = await Comment.findById(id);
  const videoId = comment.video;

  const video = await Video.findById(videoId);

  if (!comment) {
    return res.status(404).render("404", { pageTitle: "Comment not found" });
  }
  if (String(comment.owner) !== _id) {
    req.flash("error", "Not authorized");

    return res.status(403).redirect("/");
  }
  await Comment.findByIdAndDelete(id);
  video.comments = video.comments.filter((comment) => String(comment) !== id);
  await video.save();

  return res.sendStatus(200);
};
export const getCommentEdit = async (req, res) => {
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;

  const comment = await Comment.findById(id);
  const videoId = comment.video;

  if (!comment) {
    return res.status(404).render("404", { pageTitle: "Comment not found" });
  }
  if (String(comment.owner) !== user._id) {
    req.flash("error", "Not authorized");
    return res.status(403).redirect("/");
  }

  res.redirect(`/videos/${videoId}`);
};
export const postCommentEdit = async (req, res) => {
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;

  const comment = await Comment.findById(id);
  const videoId = comment.video;
  const video = await Video.findById(videoId);

  if (!comment) {
    return res.status(404).render("404", { pageTitle: "Comment not found" });
  }
  if (String(comment.owner) !== user._id) {
    req.flash("error", "Not authorized");
    return res.status(403).redirect("/");
  }
  await Comment.findByIdAndUpdate(id, {
    text,
  });

  res.redirect(`/videos/${videoId}`);
};
