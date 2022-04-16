import routes from '../routes.mjs';
import { pathToRegexp } from "path-to-regexp";

async function initializeRoutes() {
  console.log('initializing routes...');

  for await (const route of routes) {
    let params = [];
    route.regex_pattern = pathToRegexp(route.pathname, params);
    route.params = params.map(param => param.name);
  }

  console.log('routes initialized...');
}

export default initializeRoutes;