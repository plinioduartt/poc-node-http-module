import { IncomingMessage } from "http";

export type IHttpRequest = IncomingMessage & {
  body?: any;
  searchParams?: any;
  pathParams?: any;
}