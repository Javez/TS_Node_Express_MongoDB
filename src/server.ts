import path from "path";
import dotenv from "dotenv";

dotenv.config({
  path: `${path.resolve(__dirname, `../.env.${process.env.NODE_ENV}`).trim()}`,
});

import App from "./app";
import PostController from "./controllers/posts/post.controller";
import validateEnv from "./tools/validateEnv/validateEnv";
import AuthController from "./controllers/auth/auth.controller";

validateEnv();
const app = new App(
  [new AuthController(), new PostController()],
  Number(process.env.PORT)
);
app.listen();
