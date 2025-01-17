import HttpExeption from "../Http.exeption";

class NotAuthorizedExeption extends HttpExeption {
  constructor() {
    super(401, "Not authorized");
  }
}

export default NotAuthorizedExeption;
