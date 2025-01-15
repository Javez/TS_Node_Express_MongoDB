import HttpExeption from "../Http.exeption";

class UserWithThatEmailAlreadyExistsExeption extends HttpExeption {
  constructor(email: string) {
    super(400, `User with email ${email} already exists`);
  }
}

export default UserWithThatEmailAlreadyExistsExeption;
