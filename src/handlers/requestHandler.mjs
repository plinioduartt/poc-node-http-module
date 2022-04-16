import errorHandler from "./errorHandler.mjs";
import pathHandler from "./pathHandler.mjs";

async function requestHandler(request, response, next) {
  const { url, method } = request;

  let { routeFound, params } = await pathHandler({ url, method });
  request.pathParams = params;

  if (!routeFound) {
    return errorHandler({
      status: 404,
      message: "Route not found."
    }, response);
  }

  const controller = routeFound.controller;

  const methodToBeCalled = (Reflect.get(controller, routeFound.method)).bind(controller);

  if (!methodToBeCalled || typeof methodToBeCalled !== 'function') {
    return errorHandler({
      status: 400,
      message: "Not implemented."
    }, response);
  }

  await methodToBeCalled(request, response, next);
}

export default requestHandler;