import express from "express";
import {
  watch,
  getEdit,
  getUpload,
  postUpload,
  deleteVideo,
  postEdit,
  deleteComment,
  classifyImg,
} from "../controllers/videoController";
import {
  publicOnlyMiddleware,
  protectorMiddleware,
  videoUpload,
  uploadMiddleware,
} from "../middlewares";
import { client } from "../server";

const videoRouter = express.Router();

videoRouter.get("/upload", protectorMiddleware, getUpload);
videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(postEdit);
videoRouter
  .route("/upload")
  .all(protectorMiddleware)
  .get(getUpload)
  .post(
    videoUpload.fields([
      { name: "video", maxCount: 1 },
      { name: "thumb", maxCount: 1 },
    ]),
    postUpload
  );

videoRouter.post("/upload/classify", uploadMiddleware, classifyImg);
videoRouter.get("/:id([0-9a-f]{24})/delete", protectorMiddleware, deleteVideo);
export default videoRouter;
