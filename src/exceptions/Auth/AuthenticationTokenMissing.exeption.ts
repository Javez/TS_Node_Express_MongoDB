import HttpExeption from "../Http.exeption";

class AuthenticationTokenMissingExeption extends HttpExeption {
  constructor() {
    super(401, "Authentication token missing");
  }
}

export default AuthenticationTokenMissingExeption;
