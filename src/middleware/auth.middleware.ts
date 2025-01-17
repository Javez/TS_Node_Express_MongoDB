import { NextFunction, Response, Request } from "express";
import * as jwt from "jsonwebtoken";
import RequestWithUser from "../jwt/requestWithUser.interface";
import { IUser, userModel } from "../model/users/user.model";
import DataStoredInToken from "../jwt/dataStoredInTokens.interface";
import WrongAuthenticationTokenExeption from "../exceptions/Auth/WrongAuthenticationToken.exeption";
import AuthenticationTokenMissingExeption from "../exceptions/Auth/AuthenticationTokenMissing.exeption";

declare global {
  namespace Express {
    export interface Request {
      user: IUser;
    }
  }
}

async function authMiddleware(req: RequestWithUser, res: Response, next: NextFunction) {
  const cookies = req.cookies;
  if (cookies && cookies.Authorization) {
    const secret = process.env.JWT_SECRET;
    try {
      const verificationResponce = jwt.verify(
        cookies.Authorization,
        secret!
      ) as DataStoredInToken;
      const id = verificationResponce._id;
      const user = await userModel.findById(id);
      if (user) {
        req.user = user;
        next();
      } else {
        next(new WrongAuthenticationTokenExeption());
      }
    } catch (err) {
      next(new WrongAuthenticationTokenExeption());
    }
  }
}

export default authMiddleware;
