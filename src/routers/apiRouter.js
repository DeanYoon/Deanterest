import express from "express";
import {
  registerView,
  createComment,
  deleteComment,
  postCommentEdit,
  saveVideo,
  unsaveVideo,
  likeComment,
  undoLikeComment,
} from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", createComment);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment/liked", likeComment);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment/undoLiked", undoLikeComment);
apiRouter.post("/videos/:id([0-9a-f]{24})/save", saveVideo);
apiRouter.post("/videos/:id([0-9a-f]{24})/unsave", unsaveVideo);
apiRouter.post("/videos/comment/:id([0-9a-f]{24})/delete", deleteComment);
apiRouter.post(
  "/videos/:id([0-9a-f]{24})/comment/:commentId([0-9a-f]{24})/edit",
  postCommentEdit
);

export default apiRouter;
