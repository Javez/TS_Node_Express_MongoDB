import { NextFunction, Request, Response, Router } from "express";
import Controller from "../controller.interface";
import { IPost, postModel } from "../../model/posts/post.model";
import PostNotFoundExeption from "../../exceptions/Posts/PostNotFound.exeption";
import validationMiddleware from "../../middleware/validation.middleware";
import CreatePostDTO from "../../dto/posts/posts.dto";
import authMiddleware from "../../middleware/auth.middleware";
import { MiddlewareOptions } from "mongoose";

class PostController implements Controller {
  public readonly path = "/posts";
  public readonly router = Router();

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

  public addNewPost = async (req: Request, res: Response) => {
    const postData: CreatePostDTO = req.body;
    const createdPost = new postModel({ ...postData, authorId: req.user?._id });
    const savedPost = await createdPost.save();
    const result = await savedPost.populate("author", "-password");
    res.send(result);
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
