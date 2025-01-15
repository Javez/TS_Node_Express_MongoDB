import HttpExeption from "../Http.exeption";

class WrongCredentialsExeption extends HttpExeption {
  constructor() {
    super(401, "Wrong credentials");
  }
}

export default WrongCredentialsExeption;
