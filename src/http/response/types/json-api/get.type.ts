import { JsonApiResponse } from "./response.type";

export type GetJsonApiResponse = JsonApiResponse & {
  offset?: number;
  limit?: number;
}