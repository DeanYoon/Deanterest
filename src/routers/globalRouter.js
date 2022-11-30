import express from "express";
import {
  getJoin,
  postJoin,
  getLogin,
  postLogin,
} from "../controllers/userController";
import { home, search } from "../controllers/videoController";

import {
  publicOnlyMiddleware,
  protectorMiddleware,
  avatarUpload,
} from "../middlewares";
const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.route("/join").get(publicOnlyMiddleware, getJoin).post(postJoin);
globalRouter
  .route("/login")
  .get(publicOnlyMiddleware, getLogin)
  .post(postLogin);
globalRouter.get("/search", search);

export default globalRouter;
