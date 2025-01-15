import HttpExeption from "../Http.exeption";

class WrongAuthenticationTokenExeption extends HttpExeption {
  constructor() {
    super(401, "Invalid authentication token");
  }
}

export default WrongAuthenticationTokenExeption;
