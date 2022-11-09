import express from "express";
import {
  watch,
  getEdit,
  getUpload,
  postUpload,
  deleteVideo,
  postEdit,
} from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/upload", getUpload);
videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter.route("/:id(\\d+)/edit").get(getEdit).post(postEdit);
videoRouter.route("/upload").get(getUpload).post(postUpload);
videoRouter.get("/:id(\\d+)/delete", deleteVideo);

export default videoRouter;
