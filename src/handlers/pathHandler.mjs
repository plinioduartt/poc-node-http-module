import routes from '../routes.mjs';

async function pathHandler({ url, method }) {
  let params;
  let routeFound;

  for await (const route of routes) {
    if (method === route.http_method && route.regex_pattern.test(url)) {
      routeFound = route;
      
      let objParams = {};
      route.params.map((param, index) => {
        return objParams[param] = route.regex_pattern.exec(url)[index + 1];
      });
      params = objParams;

      break;
    }

    continue;
  }

  return {
    routeFound,
    params
  };
}

export default pathHandler;