import { UserController } from "./application/controllers/users.controller.mjs";

const userControllerFactory = () => {
  return new UserController();
}

let routes = [
  {
    http_method: "GET",
    pathname: "/users",
    controller: userControllerFactory(),
    method: "listAll"
  },
  {
    http_method: "GET",
    pathname: "/users/:id",
    controller: userControllerFactory(),
    method: "getOneById"
  },
  {
    http_method: "POST",
    pathname: "/users",
    controller: userControllerFactory(),
    method: "create"
  },
  {
    http_method: "PATCH",
    pathname: "/users/:id",
    controller: userControllerFactory(),
    method: "update"
  },
  {
    http_method: "DELETE",
    pathname: "/users/:id",
    controller: userControllerFactory(),
    method: "delete"
  },
];

export default routes;

