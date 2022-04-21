import UserController from "./application/users/controllers/users.controller";
import UserService from "./application/users/services/user.service";
import { HttpRoute } from "./http/routes/types/routes.type";
import UserRepository from "./infrastructure/users/repositories/mongodb-in-memory/user.repository";

const userControllerFactory = () => {
  const userRepository = new UserRepository();
  const userService = new UserService(userRepository);
  return new UserController(userService);
}

const userController = userControllerFactory();

let routes: HttpRoute[] = [
  {
    http_method: "GET",
    pathname: "/users",
    controller: userController,
    method: "listAll",
  },
  {
    http_method: "GET",
    pathname: "/users/:id",
    controller: userController,
    method: "getOneById"
  },
  {
    http_method: "POST",
    pathname: "/users",
    controller: userController,
    method: "create"
  },
  {
    http_method: "PATCH",
    pathname: "/users/:id",
    controller: userController,
    method: "update"
  },
  {
    http_method: "DELETE",
    pathname: "/users/:id",
    controller: userController,
    method: "delete"
  },
];

export default routes;

