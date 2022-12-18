import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import flash from "express-flash";
import userRouter from "./routers/userRouters";
import videoRouter from "./routers/videoRouters";
import apiRouter from "./routers/apiRouter";
import session from "express-session";
import { localsMiddleware } from "./middlewares";
import MongoStore from "connect-mongo";
import vision from "@google-cloud/vision";

const app = express();
const logger = morgan("short");
export const client = new vision.ImageAnnotatorClient({
  keyFilename: "../keyFile.json",
});

app.use(logger);

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 100000000,
    },
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
    }),
  })
);

app.use((req, res, next) => {
  req.sessionStore.all((error, sessions) => {
    next();
  });
});

app.use((req, res, next) => {
  res.header("Cross-Origin-Embedder-Policy", "credentialless");
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  next();
}); // to solve error of ffmpeg

app.use(flash());
app.use(localsMiddleware);
app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);
app.use("/api", apiRouter);
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));
export default app;
