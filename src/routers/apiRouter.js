import express from "express";
import {
  registerView,
  createComment,
  deleteComment,
  getCommentEdit,
  postCommentEdit,
  saveVideo,
  unsaveVideo,
} from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", createComment);
apiRouter.post("/videos/:id([0-9a-f]{24})/save", saveVideo);
apiRouter.post("/videos/:id([0-9a-f]{24})/unsave", unsaveVideo);

apiRouter.post("/videos/comment/:id([0-9a-f]{24})/delete", deleteComment);
apiRouter
  .route("/videos/comment/:id([0-9a-f]{24})/edit")
  .post(getCommentEdit)
  .get(postCommentEdit);
export default apiRouter;
