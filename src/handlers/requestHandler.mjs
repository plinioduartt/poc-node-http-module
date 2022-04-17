import errorHandler from "./errorHandler.mjs";
import pathHandler from "./pathHandler.mjs";

async function requestHandler(request, response, next) {
  try {
    const { url, method } = request;

    /** 
     * Handling the requested pathname and its parameters (query and path parameters)
    **/
    let { routeFound, pathParams, searchParams } = await pathHandler({ url, method });
    request.pathParams = pathParams;
    request.searchParams = searchParams;
    /** */

    if (!routeFound) {
      return errorHandler({
        status: 404,
        message: "Route not found."
      }, response);
    }

    /** 
     * Receiving and parsing request.body chunks
    **/
    const buffersReceived = [];
    for await (const chunk of request) {
      buffersReceived.push(chunk);
    }
    const data = Buffer.concat(buffersReceived).toString();
    if (!!data) {
      request.body = JSON.parse(data);
    }
    /** */

    /** 
     * Getting the controller instance and identifying the method to be called by the route
    **/
    const controller = routeFound.controller;
    const methodToBeCalled = (Reflect.get(controller, routeFound.method)).bind(controller);
    if (!methodToBeCalled || typeof methodToBeCalled !== 'function') {
      return errorHandler({
        status: 400,
        message: "Not implemented."
      }, response);
    }
    await methodToBeCalled(request, response, next);
    /** */
  } catch (error) {
    return errorHandler({
      status: 500,
      message: error.message || "Internal server error."
    }, response);
  }
}

export default requestHandler;