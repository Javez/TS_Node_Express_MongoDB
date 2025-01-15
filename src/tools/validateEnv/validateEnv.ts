import { cleanEnv, str } from "envalid";

export default function validateEnv() {
    if (process.env.NODE_ENV?.trim() === "dev") {
      cleanEnv(process.env, {
        PORT: str(),
      });
    } else if (process.env.NODE_ENV?.trim() === "prod") {
      cleanEnv(process.env, {
        PORT: str(),
      });
    } else if (process.env.NODE_ENV?.trim() === "local") {
      cleanEnv(process.env, {
        PORT: str(),
      });
    }
}
