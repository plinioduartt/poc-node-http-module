export type HttpRoute = {
  http_method: string;
  pathname: string;
  controller: any;
  method: string;
  regex_pattern?: RegExp;
  params?: any;
}