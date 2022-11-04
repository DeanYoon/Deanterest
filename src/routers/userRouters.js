import express from "express";
import { edit, remove, logout, see } from "../controllers/userController";
const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.get("/:id(\\d+)", see);
userRouter.get("/:id(\\d+)/remove", remove);
userRouter.get("/:id(\\d+)/edit", edit);
export default userRouter;
