import Video from "../models/Video";

export const home = (req, res) => {
  Video.find({}, (error, videos) => {
    console.log("errors", error);
    console.log("videos", videos);
  });
  return res.render("home", { pageTitle: "Home", videos: [] });
};

export const watch = (req, res) => {
  const id = req.params.id;

  res.render("watch", { pageTitle: `Watching`, videos: [] });
};
export const getEdit = (req, res) => {
  const id = req.params.id;

  res.render("edit", { pageTitle: `Editing ` });
};
export const postEdit = (req, res) => {
  const id = req.params.id;
  const title = req.body.title;

  return res.redirect(`/videos/${id}`);
};
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};
export const postUpload = (req, res) => {
  const { title } = req.body;

  return res.redirect("/");
};

export const deleteVideo = (req, res) => res.send("Delete Video");
