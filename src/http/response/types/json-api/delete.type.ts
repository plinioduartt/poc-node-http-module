import { JsonApiResponse } from "./response.type";

export type DeleteJsonApiResponse = JsonApiResponse & {
  message?: string;
}