import routes from '../routes.mjs';
import { URL } from 'url';

async function pathHandler({ url, method }) {
  let completeUrl = new URL(`${process.env.HOST}:${process.env.PORT}${url}`);
  let pathParams;
  let routeFound;
  let searchParamsReceived = {};

  const { pathname, searchParams } = completeUrl;

  for await (const param of searchParams.keys()) {
    const value = searchParams.get(param);
    searchParamsReceived[param] = !!isNaN(value) ? value : Number(value);
  }

  for await (const route of routes) {
    if (method === route.http_method && route.regex_pattern.test(pathname)) {
      routeFound = route;

      let objParams = {};
      route.params.map((param, index) => {
        const value = route.regex_pattern.exec(pathname)[index + 1];
        return objParams[param] = !!isNaN(value) ? value : Number(value);
      });
      pathParams = objParams;

      break;
    }

    continue;
  }

  return {
    routeFound,
    pathParams,
    searchParams: searchParamsReceived
  };
}

export default pathHandler;