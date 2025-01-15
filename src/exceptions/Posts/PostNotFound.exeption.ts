import HttpExeption from "../Http.exeption";

class PostNotFoundExeption extends HttpExeption {
  constructor(id: string) {
    super(404, `Post with id ${id} not found`);
  }
}

export default PostNotFoundExeption;
