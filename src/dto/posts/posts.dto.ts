import { IsMongoId, IsString } from "class-validator";
import { Types } from "mongoose";

class CreatePostDTO {
    @IsMongoId()
    public author: Types.ObjectId;

    @IsString()
    public content: string;

    @IsString()
    public title: string;
}

export default CreatePostDTO;