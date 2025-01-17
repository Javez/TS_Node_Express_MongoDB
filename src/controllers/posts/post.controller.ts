import { NextFunction, Request, Response, Router } from "express";
import Controller from "../controller.interface";
import { IPost, postModel } from "../../model/posts/post.model";
import PostNotFoundExeption from "../../exceptions/Posts/PostNotFound.exeption";
import validationMiddleware from "../../middleware/validation.middleware";
import CreatePostDTO from "../../dto/posts/posts.dto";
import authMiddleware from "../../middleware/auth.middleware";
import { MiddlewareOptions, Types } from "mongoose";
import { userModel } from "../../model/users/user.model";
import UserNotFound from "../../exceptions/Users/UserNotFound.exeption";
import RequestWithUser from "../../jwt/requestWithUser.interface";

class PostController implements Controller {
  public readonly path = "/posts";
  public readonly router = Router();
  private post = postModel;
  private user = userModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getPostById);
    this.router
      .all(`${this.path}/*`, authMiddleware)
      .post(this.path, validationMiddleware(CreatePostDTO), this.addNewPost)
      .patch(
        `${this.path}/:id`,
        validationMiddleware(CreatePostDTO, true),
        this.editPostById
      )
      .put(`${this.path}/:id`, this.replacePostById)
      .delete(`${this.path}/:id`, this.deletePostById);
  }

  public getAllPosts = (req: Request, res: Response) => {
    postModel.find().then((posts) => {
      res.send(posts);
    });
  };

  public getPostById = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    postModel.findById(id).then((post) => {
      post ? res.send(post) : next(new PostNotFoundExeption(id));
    });
  };

  //Find one
  /*public getPostById = (req: Request, res: Response) => {
    const id = req.params.id;
    postModel.findOne({ _id: id }).then((post) => {
      res.send(post);
    })
  }*/

  public addNewPost = async (
    request: RequestWithUser,
    response: Response,
    next: NextFunction
  ) => {
    const postData: CreatePostDTO = request.body;
    const createdPost = new this.post({
      ...postData,
      authors: [request.user._id],
    });
    const user = await this.user.findById(request.user._id);
    if (user) {
      const posts = user.posts;
      if (posts) {
        user.posts = [...(user.posts || []), createdPost._id] as Types.ObjectId[];
        await user.save();
        const savedPost = await createdPost.save();
        await savedPost.populate("authors", "-password");
        response.send(savedPost);
      }
    } else next(new UserNotFound());
  };

  //{new} return updated file not a old one
  //edit only provided properties, left other fields without changes;
  public editPostById = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const postData: CreatePostDTO = req.body;
    postModel.findByIdAndUpdate(id, postData, { new: true }).then((post) => {
      res.send(post) ? res.send(post) : next(new PostNotFoundExeption(id));
      //custom status
      //res.status(404).send({ error: "not foudn"})
    });
  };

  //replace all properties with the provided one, do not save old properties you dont provided.
  public replacePostById = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const id = req.params.id;
    const postData: CreatePostDTO = req.body;
    postModel.findByIdAndUpdate(id, postData).then((post) => {
      res.send(post) ? res.send(post) : next(new PostNotFoundExeption(id));
    });
  };

  public deletePostById = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    postModel.findByIdAndDelete(id).then((result) => {
      result ? res.send("Post deleted") : next(new PostNotFoundExeption(id));
    });
  };
}

export default PostController;
