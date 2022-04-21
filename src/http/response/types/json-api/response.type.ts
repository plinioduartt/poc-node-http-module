import { ServerResponse } from "http";

export type JsonApiResponse = ServerResponse & {
  data?: any;
}