import mongoose, { Document, Schema, model } from "mongoose";
import { IAddress, addressSchema } from "../address/address.model";

interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  address?: IAddress;
}

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  address: addressSchema,
});

const userModel = model<IUser & mongoose.Document>("User", userSchema);

export { IUser, userModel };
