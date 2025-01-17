import mongoose, { Document, Schema, Types, model } from "mongoose";
import { IAddress, addressSchema } from "../address/address.model";
import { IPost } from "../posts/post.model";

interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  address?: IAddress;
  posts?: Types.ObjectId[];
}

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  address: addressSchema,
  posts: [{ type: Schema.Types.ObjectId, ref: "Post", required: false }],
});

const userModel = model<IUser & mongoose.Document>("User", userSchema);

export { IUser, userModel };
