import routes from '../routes.mjs';
import { pathToRegexp } from "path-to-regexp";
import logger from '../utils/logger.mjs';

async function initializeRoutes() {
  logger.info({}, 'initializing routes...');

  for await (const route of routes) {
    let params = [];
    route.regex_pattern = pathToRegexp(route.pathname, params);
    route.params = params.map(param => param.name);
  }

  logger.info({}, 'routes initialized...');
}

export default initializeRoutes;