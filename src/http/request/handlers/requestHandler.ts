import httpErrorHandler from "../../response/handlers/httpErrorHandler";
import pathHandler, { PathHandlerProps } from "./pathHandler";
import logger from "../../../utils/logger";
import CustomError from "../../../errors/CustomError";
import { IHttpResponse } from "../../response/types/response.type";
import { IHttpRequest } from "../types/request.type";

async function requestHandler(request: IHttpRequest, response: IHttpResponse, next: any) {
  try {
    const { url, method } = request;

    /** 
     * Handling the requested pathname and its parameters (query and path parameters)
    **/
    let { routeFound, pathParams, searchParams } = await pathHandler({ url, method } as PathHandlerProps);
    request.pathParams = pathParams;
    request.searchParams = searchParams;
    /** */

    if (!routeFound) {
      throw new CustomError({ status: 404, message: "Route not found." });
    }

    /** 
     * Receiving and parsing request.body chunks
    **/
    const buffersReceived = [];
    for await (const chunk of request) {
      buffersReceived.push(chunk as Uint8Array);
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
      throw new CustomError({ status: 400, message: "Not implemented." });
    }
    await methodToBeCalled(request, response, next);
    /** */
  } catch (error: any) {
    logger.debug('Error in request handler ==> ' + error);
    logger.debug('Error status ==> ' + error.status);
    logger.debug('Error message ==> ' + error.message);
    return httpErrorHandler({
      status: error.status || 500,
      message: error.message || "Internal server error."
    }, response);
  }
}

export default requestHandler;