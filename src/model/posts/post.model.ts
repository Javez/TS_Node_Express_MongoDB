import mongoose, { Document, Schema, Types, model } from "mongoose";
import { IUser } from "../users/user.model";


interface IPost extends Document {
  author: Types.ObjectId | IUser;
  content: string;
  title: string;
}

const postSchema = new Schema<IPost>({
  author: { ref: "User", type: Schema.Types.ObjectId, required: true },
  content: { type: String, required: true },  
  title: { type: String, required: true }
});

const postModel = model<IPost & mongoose.Document>("Post", postSchema);

export { IPost, postSchema, postModel };