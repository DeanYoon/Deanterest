import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";

const PORT = 5000;

const app = express();
const logger = morgan("short");
app.use(logger);

app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

const handleListening = () => console.log(`Server listening on port ${PORT}`);

app.listen(PORT, handleListening);
