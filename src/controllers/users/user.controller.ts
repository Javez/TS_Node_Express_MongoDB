import * as express from "express";
import NotAuthorizedExeption from "../../exceptions/Auth/NotAuthorized.exeption";
import Controller from "../controller.interface";
import RequestWithUser from "../../jwt/requestWithUser.interface";
import authMiddleware from "../../middleware/auth.middleware";
import { postModel } from "../../model/posts/post.model";

class UserController implements Controller {
  public path = "/users";
  public router = express.Router();
  private post = postModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}/:id/posts`,
      authMiddleware,
      this.getAllPostsOfUser
    );
  }

  private getAllPostsOfUser = async (
    request: RequestWithUser,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const userId = request.params.id;
    if (request.user && userId === request.user._id.toString()) {
      const posts = await this.post.find({ author: userId });
      response.send(posts);
    }
    next(new NotAuthorizedExeption());
  };
}

export default UserController;
