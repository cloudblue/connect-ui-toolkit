import { toolkitPlugin, useToolkit } from './toolkit';
import { inject } from 'vue';


jest.mock('vue', () => {
  const actualModule = jest.requireActual('vue');

  return {
    ...actualModule,
    inject: jest.fn().mockReturnValue('injectStub'),
  };
});

describe('Toolkit Vue plugin', () => {
  let result;

  describe('#useToolkit', () => {
    beforeEach(() => {
      result = useToolkit();
    });

    it('calls inject with "toolkit" as its argument', () => {
      expect(inject).toHaveBeenCalledWith('toolkit');
    });

    it('returns the result of the inject call', () => {
      expect(result).toEqual('injectStub');
    });
  });

  describe('#toolkitPlugin', () => {
    it('exposes the correct plugin object', () => {
      expect(toolkitPlugin).toEqual({ install: expect.any(Function) });
    });

    describe('plugin install function', () => {
      let vueApp;
      let toolkitInstance;

      beforeEach(() => {
        vueApp = {
          provide: jest.fn(),
          config: { globalProperties: {} },
        };
        toolkitInstance = {
          watch: jest.fn().mockImplementation((_, callback) => callback({ foo: 'bar' })),
          navigateTo: jest.fn(),
        };

        toolkitPlugin.install(vueApp, toolkitInstance);
      });

      it('provides the toolkit to the vue app instance', () => {
        expect(vueApp.provide).toHaveBeenCalledWith('toolkit', {
          watch: expect.any(Function),
          navigateTo: expect.any(Function),
          sharedContext: expect.any(Object),
        });
      });

      it('adds the toolkit to the vue app as a global property', () => {
        expect(vueApp.config.globalProperties.$toolkit).toEqual({
          watch: expect.any(Function),
          navigateTo: expect.any(Function),
          sharedContext: expect.any(Object),
        });
      });

      it('calls the toolkit\'s watch method to watch for data changes', () => {
        expect(toolkitInstance.watch).toHaveBeenCalledWith('*', expect.any(Function), { immediate: true });
      });

      it('updates the sharedContext object when the toolkit watch callback is called', () => {
        expect(vueApp.config.globalProperties.$toolkit.sharedContext).toEqual({ foo: 'bar' });
      });
    });
  });
});
