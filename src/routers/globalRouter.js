import express from "express";

const globalRouter = express.Router();

const handleHome = (req, res) => res.send("Hello!");

globalRouter.get("/", handleHome);

export default globalRouter;
