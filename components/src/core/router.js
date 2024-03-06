import { connectPortalRoutes, connectPortalRoutesDict } from '~constants/portal-routes';

const processRegisteredRoute = (route, param) => {
  const spaRoute = connectPortalRoutes[route];
  let processedRoute = { name: '' };

  if (!spaRoute) {
    throw new Error(
      `[Connect UI Toolkit]: Route ${route.toString()} does not exist.\nThe following routes are available:\n${Object.keys(connectPortalRoutesDict).join(', ')}`,
    );
  }

  if (typeof spaRoute === 'string') {
    processedRoute.name = spaRoute;
  } else {
    processedRoute.name = spaRoute.name;
    processedRoute.params = {};

    if (spaRoute.tab) {
      processedRoute.params.tab = spaRoute.tab;
    }

    if (spaRoute.requires) {
      if (!param) {
        throw new Error(
          `[Connect UI Toolkit]: Route ${route.toString()} requires the ${spaRoute.requires} parameter.`,
        );
      }

      processedRoute.params[spaRoute.requires] = param;
    }
  }

  return processedRoute;
};

export const processRoute = (route, param) => {
  if (!route) {
    throw new Error('[Connect UI Toolkit]: Empty route cannot be processed.');
  }

  // If route is an object or a string, avoid processing
  if (['object', 'string'].includes(typeof route)) {
    return route;
  }

  // If route is symbol, process it according to the registered spa routes
  if (typeof route === 'symbol') {
    return processRegisteredRoute(route, param);
  }

  throw new Error(
    `[Connect UI Toolkit]: Route could not be processed. Route is: ${JSON.stringify(route)}`,
  );
};
