import bcrypt from "bcrypt";
import express, { response } from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import UserWithThatEmailAlreadyExistsExeption from "../../exceptions/Users/UserWithThatEmailAlreadyExists.exeption";
import WrongCredentialsExeption from "../../exceptions/Auth/WrongCredentials.exeption";
import Controller from "../controller.interface";
import validationMiddleware from "../../middleware/validation.middleware";
import { userModel, IUser } from "../../model/users/user.model";
import CreateUserDTO from "../../dto/auth/users.dto";
import CreateLoginDTO from "../../dto/auth/login.dto";
import TokenData from "../../jwt/tokenData.interface";
import DataStoredInToken from "../../jwt/dataStoredInTokens.interface";

class AuthController implements Controller {
  readonly path = "/auth";
  readonly router = express.Router();
  private user = userModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(CreateUserDTO),
      this.registration
    );
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(CreateLoginDTO),
      this.login
    );

    this.router.post(`${this.path}/logout`, this.logginOut);
  }

  private registration = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const userData: CreateUserDTO = req.body;
    if (await this.user.findOne({ email: userData.email })) {
      next(new UserWithThatEmailAlreadyExistsExeption(userData.email));
    } else {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await this.user.create({
        ...userData,
        password: hashedPassword,
      });
      const { password, ...userWithoutPassword } = user.toJSON();
      const tokenData = this.createToken(user);
      res.setHeader("Set-Cookie", [this.createCookie(tokenData)]);
      res.send(userWithoutPassword);
    }
  };

  private login = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const loginData: CreateLoginDTO = req.body;
    const user = await this.user.findOne({ email: loginData.email });
    if (user) {
      const isPasswordMatching = await bcrypt.compare(
        loginData.password,
        user.password
      );
      if (isPasswordMatching) {
        const { password, ...userWithoutPassword } = user.toJSON();
        const tokenData = this.createToken(user);
        response.setHeader("Set-Cookie", [this.createCookie(tokenData)]);
        res.send(userWithoutPassword);
      } else {
        next(new WrongCredentialsExeption());
      }
    } else {
      next(new WrongCredentialsExeption());
    }
  };

  private logginOut = (req: express.Request, res: express.Response) => {
    response.setHeader("Set-Cookie", ["Authorization=; Max-age=0"]);
    res.send(200);
  };

  private createToken(user: IUser): TokenData {
    const expiresIn = 60 * 60;
    const secret = process.env.JWT_SECRET;
    const dataStoredInToken: DataStoredInToken = {
      _id: user._id,
    };

    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret!, { expiresIn: expiresIn }),
    };
  }

  private createCookie(tokenData: TokenData) {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}

export default AuthController;
