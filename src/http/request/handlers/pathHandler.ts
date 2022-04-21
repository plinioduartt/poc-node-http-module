import routes from '../../../routes';
import { URL } from 'url';
import { HttpRoute } from '../../routes/types/routes.type';

export type PathHandlerProps = {
  url: string | undefined;
  method: string;
}

async function pathHandler({ url, method }: PathHandlerProps) {
  /**
   * Arrange
   */

  // Get the complete URL with url node module, from the given path 
  // With this completeUrl we can get some attributes like pathname and searchParams
  let completeUrl = new URL(`${process.env.HOST}:${process.env.PORT}${url}`);
  const { pathname, searchParams } = completeUrl;

  // Variables to get set
  let routeFound: HttpRoute | undefined;
  let searchParamsReceived: any = {};
  let pathParams: any = {};

  /** */


  /**
   * Async iterator to get searchParams into a valid JSON format
   */

  for await (const param of searchParams.keys()) {
    const value = searchParams.get(param);
    searchParamsReceived[param] = !!isNaN(Number(value)) ? value : Number(value);
  }

  /** */


  /**
   * Async iterator to get the right called route and its path params
   */

  for await (const route of routes as HttpRoute[]) {
    if (method === route.http_method && route.regex_pattern?.test(pathname)) {
      routeFound = route;

      let objParams: any = {};

      // Mapping the HttpRoute params property to set all the pathParams values
      route.params.map((param: string, index: number) => {
        const currIndex: number = ++index;
        const value = route.regex_pattern?.exec(pathname);
        if (value) {
          return objParams[param] = !!isNaN(Number(value[currIndex])) ? value[currIndex] : Number(value[currIndex]);
        }

        return;
      });

      pathParams = objParams;

      break;
    }

    continue;
  }

  /** */

  return {
    routeFound,
    pathParams,
    searchParams: searchParamsReceived
  };
}

export default pathHandler;