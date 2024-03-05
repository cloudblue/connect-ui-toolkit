import { connectPortalRoutes, connectPortalRoutesDict } from '~constants/portal-routes';

import { processRoute } from '~core/router';

describe('#processRoute', () => {
  let result;
  let err;

  beforeEach(() => {
    result = undefined;
    err = undefined;
  });

  describe('if route is not used', () => {
    it('throws an error', () => {
      try {
        processRoute();
      } catch (e) {
        err = e;
      }

      expect(err).toBeInstanceOf(Error);
      expect(err.message).toEqual('[Connect UI Toolkit]: Empty route cannot be processed.');
    });
  });

  describe('if route is a String', () => {
    it('returns the route without processing', () => {
      result = processRoute('foo');

      expect(result).toEqual('foo');
    });
  });

  describe('if route is an Object', () => {
    it('returns the route without processing', () => {
      result = processRoute({ foo: 'bar' });

      expect(result).toEqual({ foo: 'bar' });
    });
  });

  describe('if route is a Symbol', () => {
    it('throws an error if the route is not part of the connect portal routes', () => {
      const fakeRoute = Symbol('foo');

      try {
        processRoute(fakeRoute);
      } catch (e) {
        err = e;
      }

      expect(err).toBeInstanceOf(Error);
      expect(err.message).toEqual(
        `[Connect UI Toolkit]: Route ${fakeRoute.toString()} does not exist.\nThe following routes are available:\n${Object.keys(connectPortalRoutesDict).join(', ')}`,
      );
    });

    it('returns the correct route for a simple route', () => {
      const simpleRoute = connectPortalRoutesDict.dashboard;

      result = processRoute(simpleRoute);

      expect(result).toEqual({ name: connectPortalRoutes[simpleRoute] });
    });

    it('returns the correct route for a route that has a tab', () => {
      const routeWithTab = connectPortalRoutesDict.fulfillmentRequests;

      result = processRoute(routeWithTab);

      expect(result).toEqual({
        name: connectPortalRoutes[routeWithTab].name,
        params: {
          tab: connectPortalRoutes[routeWithTab].tab,
        },
      });
    });

    it('throws an error if the route requires a parameter that is not sent', () => {
      const routeWithRequiredParameter = connectPortalRoutesDict.marketplaceDetails;

      try {
        processRoute(routeWithRequiredParameter);
      } catch (e) {
        err = e;
      }

      expect(err).toBeInstanceOf(Error);
      expect(err.message).toEqual(
        `[Connect UI Toolkit]: Route ${routeWithRequiredParameter.toString()} requires the ${connectPortalRoutes[routeWithRequiredParameter].requires} parameter.`,
      );
    });

    it('returns the correct route for a route that requires a parameter and it is sent', () => {
      const routeWithRequiredParameter = connectPortalRoutesDict.marketplaceDetails;

      result = processRoute(routeWithRequiredParameter, 'MKP-123');

      expect(result).toEqual({
        name: connectPortalRoutes[routeWithRequiredParameter].name,
        params: {
          [connectPortalRoutes[routeWithRequiredParameter].requires]: 'MKP-123',
        },
      });
    });
  });
});
