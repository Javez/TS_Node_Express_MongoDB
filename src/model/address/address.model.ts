import { Schema, model } from "mongoose";

interface IAddress {
    city: string;
    street: string;
}

const addressSchema = new Schema<IAddress>({
    city: { type: String, required: false },
    street: { type: String, required: false },
})

const addressModel = model<IAddress>("Address", addressSchema);

export { IAddress, addressSchema, addressModel }