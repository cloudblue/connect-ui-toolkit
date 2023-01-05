import { createApp } from 'vue/dist/vue.esm-bundler';
import { reactive } from 'vue';
import {
  rootEmit,
  observe,
  create,
} from './vue-plugin';


jest.mock('vue/dist/vue.esm-bundler', () => {
  const app = {
    component: jest.fn(),
    provide: jest.fn(),
    mount: jest.fn(() => app),
    unmount: jest.fn(),
    config: {
      unwrapInjectedRef: false,
      compilerOptions: {
        isCustomElement: () => {},
      },
    },
  };

  return {
    createApp: jest.fn().mockReturnValue(app),
  };
});

jest.mock('vue', () => ({
  reactive: jest.fn(v => v),
}));

describe('rootEmit', () => {
  beforeEach(() => {
    global.window.dispatchEvent = jest.fn();

    global.CustomEvent = jest.fn().mockImplementation(
      (name, options) => ({ name, options })
    );

    rootEmit('foo', 'bar');
  });

  it('should create correct CustomEvent', () => {
    expect(CustomEvent).toHaveBeenCalledWith('foo', { detail: 'bar' });
  });

  it('should dispatch requested event on window', () => {
    expect(window.dispatchEvent).toHaveBeenCalledWith({ name: 'foo', options: { detail: 'bar' } });
  });
});

describe('observe', () => {
  it('should return keys of component props if present', () => {
    expect(observe({ props: { foo: 'bar', fuz: 'buz' } })).toEqual(['foo', 'fuz']);
  });

  it('should fallback to an empty array if no props detected', () => {
    expect(observe({})).toEqual([]);
  });
});

describe('create', () => {
  let call;
  let result;
  let boiler;
  let component;
  let storeInstaller;

  beforeEach(() => {
    component = 'COMPONENT';
    storeInstaller = jest.fn();

    boiler = {
      settings: {
        customs: ['foo'],
      },
      getState: jest.fn(() => ({ foo: 'bar' })),
      content: '<foo>bar</foo>',
      element: 'ELEMENT',
    };
    
    call = () => {
      result = create(boiler, component, storeInstaller);
    }
  });

  it('should set app config.unwrapInjectedRef to true', () => {
    call();
    const app = result.mount();
    expect(app.config.unwrapInjectedRef).toBeTruthy();
  });

  describe('customs', () => {
    it.each([
      [{ customs: ['foo', 'bar'] }, 'foo', true],
      [{ customs: ['foo', 'bar'] }, 'bar', true],
      [{ customs: ['foo', 'bar'] }, 'content', true],
      [{ customs: ['foo'] }, 'bar', false],
      [{}, 'content', true],
      [null, 'content', true],
    ])('for %j customs %j should be %j', (settings, tag, res) => {
      boiler.settings = settings;
      call();
      const app = result.mount();
      expect(app.config.compilerOptions.isCustomElement(tag)).toBe(res);
    })
  });

  describe('state', () => {
    beforeEach(() => {
      call();
    });

    it('should receive state from boiler', () => {
      expect(boiler.getState).toHaveBeenCalled();
    });

    it('should vue-based reactivity for requested state', () => {
      expect(reactive).toHaveBeenCalledWith({ foo: 'bar' });
    });

    it('should bind state to a newly created app', () => {
      expect(createApp).toHaveBeenCalledWith({
        template: '<widget v-bind=\"state\"><foo>bar</foo></widget>',
        computed: { state: expect.any(Function) },
      });
    });

    it('should return state as computed defined in wrapper - to grant correct binding', () => {
      expect(createApp.mock.calls[0][0].computed.state()).toEqual({ foo: 'bar' });
    });

    it('should be updated with watch() callback', () => {
      result.watch('foo', 'buz');
      expect(createApp.mock.calls[0][0].computed.state()).toEqual({ foo: 'buz' });
    });
  });

  describe('storeInstaller', () => {
    it('should call storeInstaller with app passed', () => {
      call();
      const app = result.mount();
      expect(storeInstaller).toHaveBeenCalledWith(app);
    });
  });

  describe('Adding serving components', () => {
    let app;

    beforeEach(() => {
      call();
      app = result.mount();
    });

    it('should add system "widget" component', () => {
      expect(app.component).toHaveBeenCalledWith('widget', 'COMPONENT');
    });

  });

  describe('Providing tools to an app', () => {
    let app;

    beforeEach(() => {
      call();
      app = result.mount();
    });

    it('should provide boiler as $boiler', () => {
      expect(app.provide).toHaveBeenCalledWith('$boiler', boiler);
    });

    it('should provide $injector emitter', () => {
      expect(app.provide).toHaveBeenCalledWith('$injector', expect.any(Function));
    });

    it('should provide rootEmit decorator as an $injector', () => {
      global.window.dispatchEvent = jest.fn();

      global.CustomEvent = jest.fn().mockImplementation(
        (name, options) => ({ name, options })
      );

      app.provide.mock.calls[1][1]('foo', 'bar');

      expect(window.dispatchEvent).toHaveBeenCalledWith(new CustomEvent('$injector', {
        detail: {
          type: 'foo',
          data: 'bar',
        },
      }));
    });
  });

  describe('unmount', () => {
    it('should trigger app.unmount', () => {
      call();
      const app = result.mount();
      result.unmount();
      expect(app.unmount).toHaveBeenCalled();
    });
  });
});