import HttpExeption from "../Http.exeption";

class UserNotFound extends HttpExeption {
  constructor() {
    super(404, `User not found`);
  }
}

export default UserNotFound;
