import { JsonApiResponse } from "./response.type";

export type CreateJsonApiResponse = JsonApiResponse & {
  message?: string;
}