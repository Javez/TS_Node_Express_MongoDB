import { Request } from "express";
import { IUser } from "../model/users/user.model";

interface RequestWithUser extends Request {
  user: IUser;
}

export default RequestWithUser;
