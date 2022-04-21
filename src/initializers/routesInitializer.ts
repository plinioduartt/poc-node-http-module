import routes from '../routes';
import { Key, pathToRegexp } from "path-to-regexp";
import logger from '../utils/logger';
import { HttpRoute } from '../http/routes/types/routes.type';

async function initializeRoutes() {
  logger.info({}, 'initializing routes...');

  for await (const route of routes as HttpRoute[]) {
    let params: Key[] = [];
    route.regex_pattern = pathToRegexp(route.pathname, params);
    route.params = params.map(param => param.name);
  }

  logger.info({}, 'routes initialized...');
}

export default initializeRoutes;