import embed from './embed';
import { createApp } from 'vue/dist/vue.esm-bundler';


jest.mock('vue', () => ({
  reactive: jest.fn(v => v),
}));

jest.mock('vue/dist/vue.esm-bundler', () => ({
  createApp: jest.fn(() => ({
    provide: jest.fn(),
    mount: jest.fn(),
    component: jest.fn(),
    config: {
      unwrapInjectedRef: false,
      compilerOptions: {
        isCustomElement: () => {},
      }
    }
  })),
}));

describe('embed()', () => {
  let call;
  let name;
  let Widget;

  beforeEach(() => {
    global.customElements.define = jest.fn();
    global.HTMLElement = class {};

    call = (_bus, _name, _component, _customs) => {
      embed(_bus, _name, _component, _customs);
      name = global.customElements.define.mock.calls[0][0];
      Widget = global.customElements.define.mock.calls[0][1];
    }
  });

  describe('initial sets', () => {
    it('should register tag with proper name', () => {
      call({}, 'test-name', {});

      expect(name).toBe('test-name');
    });

    it('should set empty object as $state when no keys passed', () => {
      call({}, 'test-name', {});

      expect((new Widget()).$state).toEqual({});
    });

    it('should set an object created of passed keys as initial state', () => {
      call({}, 'test-name', { $attrs: ['foo', 'bar'] });

      expect((new Widget()).$state).toEqual({
        foo: null,
        bar: null,
      });
    });
  });

  describe('component.$publishers', () => {
    let widget;
    let name1;
    let name2;
    let callback1;
    let callback2;

    beforeEach(() => {
      call({}, 'test-name', { $publishes: ['foo', 'bar'] });
      Widget.prototype.$catch = jest.fn();

      widget = new Widget();

      name1 = Widget.prototype.$catch.mock.calls[0][0];
      name2 = Widget.prototype.$catch.mock.calls[1][0];
      callback1 = Widget.prototype.$catch.mock.calls[0][1];
      callback2 = Widget.prototype.$catch.mock.calls[1][1];
    });

    it('should emit events with proper names', () => {
      expect(name1).toBe('$subscribe:foo');
      expect(name2).toBe('$subscribe:bar');
    });

    it('listeners list should be empty by default', () => {
      expect(widget.$subscribers['foo']).toBeUndefined();
    });

    it('listeners list should be inited properly', () => {
      callback1({ handler: () => {} });
      expect(widget.$subscribers['foo'].length).toBe(1);
    });

    it('should add listeners to existing list', () => {
      callback1({ handler: () => {} });
      callback1({ handler: () => {} });
      expect(widget.$subscribers['foo'].length).toBe(2);
    });

    it('listeners list should be inited properly', () => {
      const handler = jest.fn();
      callback1({ handler });
      widget.$subscribers['foo'][0]();
      expect(handler).toHaveBeenCalled();
    });
  });

  describe('#$emit()', () => {
    let widget;

    beforeEach(() => {
      global.CustomEvent = jest.fn((name, detail) => ({ name, detail }));

      call({}, 'test-name', {});

      widget = new Widget();
      widget.dispatchEvent = jest.fn();
      widget.$emit('foo', 'BAR');
    });

    it('should call dispatchEvent', () => {
      expect(widget.dispatchEvent).toHaveBeenCalled();
    });

    it('should create CustomEvent with roper data', () => {
      expect(CustomEvent).toHaveBeenCalledWith( 'foo', {
        bubbles: true,
        detail: 'BAR',
      });
    });

    it('should call dispatchEvent with generated data', () => {
      expect(widget.dispatchEvent).toHaveBeenCalledWith({
        name: 'foo',
        detail: {
          bubbles: true,
          detail: 'BAR',
        },
      });
    });
  });

  describe('#$catch()', () => {
    let widget;
    let handler;
    let name;
    let callback;
    let event;

    beforeEach(() => {
      handler = jest.fn();
      event = {
        stopPropagation: jest.fn(),
        detail: 'EVENT_DETAIL',
      };

      call({}, 'test-name', {});

      widget = new Widget();
      widget.addEventListener = jest.fn();
      widget.$catch('foo', handler);
      name = widget.addEventListener.mock.calls[0][0];
      callback = widget.addEventListener.mock.calls[0][1];

      callback(event);
    });

    it('should add event listener', () => {
      expect(widget.addEventListener).toHaveBeenCalled();
    });

    it('should set event listner for proper name', () => {
      expect(name).toBe('foo');
    });

    it('should stop of event propagation', () => {
      expect(event.stopPropagation).toHaveBeenCalled();
    });

    it('should call handler with event detail', () => {
      expect(handler).toHaveBeenCalledWith('EVENT_DETAIL');
    });
  });

  describe('#connectedCallback()', () => {
    let component;
    let bus;
    let widget;

    beforeEach(() => {
      component = {
        $attrs: ['test'],
        $style: { color: 'red' }
      };

      bus = { bus: 'BUS' };

      call(bus, 'test-name', component, ['check-one', 'check-two']);
      widget = new Widget();
      widget.$catch = jest.fn();
      widget.getAttribute = jest.fn(v => `${v}_val`);
      widget.style = {};
      widget.connectedCallback();

      global.window.dispatchEvent = jest.fn();
    });

    it('should set $app', () => {
      expect(createApp).toHaveBeenCalledWith(component);
    });

    it('should set #$app.config.unwrapInjectedRef option', () => {
      expect(widget.$app.config.unwrapInjectedRef).toBeTruthy();
    });

    it('should set #$app.config.unwrapInjectedRef.isCustomElement correctly', () => {
      expect(widget.$app.config.compilerOptions.isCustomElement('check-one')).toBeTruthy();
    });

    it('should set #$app.config.unwrapInjectedRef.isCustomElement correctly', () => {
      expect(widget.$app.config.compilerOptions.isCustomElement('check-two')).toBeTruthy();
    });

    it('should set #$app.config.unwrapInjectedRef.isCustomElement correctly', () => {
      expect(widget.$app.config.compilerOptions.isCustomElement('wrong-one')).toBeFalsy();
    });

    it('should call $app.provide with proper data', () => {
      expect(widget.$app.provide.mock.calls).toEqual([
        ['$state', { test: 'test_val' }],
        ['$bus', { bus: 'BUS' }],
        ['$injector', expect.any(Function)],
        ['$publish', expect.any(Function)],
        ['$subscribe', expect.any(Function)],
        ['$dispatch', expect.any(Function)],
        ['$listen', expect.any(Function)],
      ])
    });

    describe('should use valid callbacks for events interface', () => {
      let $injector;
      let $publish;
      let $subscribe;
      let $dispatch;
      let $listen;

      beforeEach(() => {
        $injector = widget.$app.provide.mock.calls[2][1];
        $publish = widget.$app.provide.mock.calls[3][1];
        $subscribe = widget.$app.provide.mock.calls[4][1];
        $dispatch = widget.$app.provide.mock.calls[5][1];
        $listen = widget.$app.provide.mock.calls[6][1];
      });

      describe('$injector callback', () => {
        it('should create proper CustomEvent', () => {
          global.CustomEvent = jest.fn();
          $injector('test', { test: 'TEST' });

          expect(CustomEvent).toHaveBeenCalledWith('$injector', {
            detail: {
              type: 'test',
              data: {
                test: 'TEST',
              },
            },
          });
        });
      });

      describe('$publish callback', () => {
        let handler;

        beforeEach(() => {
          component.$publishes = ['test'];
          handler = jest.fn();

          // Recreate all beforeEach stuff with new setup
          call(bus, 'test-name', component, ['check-one', 'check-two']);
          Widget.prototype.$catch = jest.fn();
          widget = new Widget();
          widget.getAttribute = jest.fn();
          widget.style = {};
          widget.connectedCallback();
          $publish = widget.$app.provide.mock.calls[3][1];

          widget.$subscribers = {
            test: [handler],
          };
        });

        it('should call all subscribers handlers if presented', () => {
          $publish('test', 'TEST');

          expect(handler).toHaveBeenCalledWith('TEST');
        });

        it('should early return when no intersection with $publishes', () => {
          widget.$subscribers.other = {
            forEach: jest.fn(),
          };

          $publish('other', 'TEST');

          expect(widget.$subscribers.other.forEach).not.toHaveBeenCalled();
        });

        it('should early return when no intersection with $publishes', () => {
          let err;

          try {
            $publish('other', 'TEST');
          } catch (e) {
            err = e;
          }

          expect(err).toBeUndefined();
        });
      });

      describe('$subscribe', () => {
        beforeEach(() => {
          widget.$emit = jest.fn();
          $subscribe('test', () => 'foo');
        });

        it('should emit event with proper name', () => {
          expect(widget.$emit).toHaveBeenCalledWith(
            '$subscribe:test', {
              handler: expect.any(Function),
            });
        });

        it('should provide valid handler', () => {
          expect(widget.$emit.mock.calls[0][1].handler()).toBe('foo');
        });
      });

      describe('$dispatch', () => {
        it('should emit event with proper name', () => {
          widget.$emit = jest.fn();
          $dispatch('test', 'foo');
          expect(widget.$emit).toHaveBeenCalledWith('$dispatch:test', 'foo');
        });
      });

      describe('$listen', () => {
        beforeEach(() => {
          widget.$catch = jest.fn();
          $listen('test', () => 'foo');
        });

        it('should emit event with proper name', () => {
          expect(widget.$catch).toHaveBeenCalledWith(
            '$dispatch:test',
            expect.any(Function),
          );
        });

        it('should provide valid handler', () => {
          expect(widget.$catch.mock.calls[0][1]()).toBe('foo');
        });
      });
    });

    describe('initialize attributes', () => {
      it('should set attributes for each in component.$attrs items', () => {
        expect(widget.$state).toEqual({ test: 'test_val' });
      });

      it('should get attributes values with getAttribute method', () => {
        expect(widget.getAttribute).toHaveBeenCalledWith('test');
      });

      it('should not set anything if no attrs provided', () => {
        embed({}, 'test-widget', {});
        Widget = global.customElements.define.mock.calls[1][1];
        widget = new Widget();
        widget.getAttribute = jest.fn(v => `${v}_val`);
        widget.connectedCallback();

        expect(widget.getAttribute).not.toHaveBeenCalled();
      });
    });

    describe('process innerHtml', () => {
      beforeEach(() => {
        widget.getAttribute = jest.fn(v => `${v}_val`);
      });

      it('should not set content when no innerHtml passed ', () => {
        widget.connectedCallback();
        expect(widget.content).toBeUndefined();
      });

      it('should set content when innerHtml passed', () => {
        widget.innerHTML = 'Lorem Ipsum';
        widget.connectedCallback();
        expect(widget.content).toBe('Lorem Ipsum');
      });

      it('should call $app.component with template set as passed content', () => {
        widget.innerHTML = 'Lorem Ipsum';
        widget.connectedCallback();
        expect(widget.$app.component).toHaveBeenCalledWith('content', {
          template: 'Lorem Ipsum',
        });
      });
    });

    describe('process styles of a wrapper', () => {
      it('should set styles passed as object', () => {
        expect(widget.style).toEqual({ color: 'red' });
      });

      it('should set styles passed as a function', () => {
        embed({}, 'test-widget', {
          $style: () => ({ color: 'RED' }),
        });
        Widget = global.customElements.define.mock.calls[1][1];
        widget = new Widget();
        widget.style = {};
        widget.getAttribute = jest.fn(v => `${v}_val`);
        widget.connectedCallback();

        expect(widget.style).toEqual({ color: 'RED' });
      });
    });

    it('should run $app.mount after all', () => {
      expect(widget.$app.mount).toHaveBeenCalled();
    });
  });

  describe('#disconnectedCallback', () => {
    it('should call $appunmount', () => {
      call({}, 'test', {});
      const widget = new Widget();
      widget.$app = {
        unmount: jest.fn(),
      };
      widget.disconnectedCallback();

      expect(widget.$app.unmount).toHaveBeenCalled();
    });
  });

  describe('#observedAttributes', () => {
    it('should return components $attrs', () => {
      call({}, 'test', { $attrs: ['test', 'other-test'] });

      expect(Widget.observedAttributes).toEqual(['test', 'other-test']);
    });
  });

  describe('#attributeChangedCallback', () => {
    let widget;

    beforeEach(() => {
      call({}, 'test', {
        $attrs: ['test'],
      });

      widget = new Widget();
    });

    it('should change $state value if existing attribute changed', () => {
      widget.attributeChangedCallback('test', 'old', 'new');
      expect(widget.$state.test).toBe('new');
    });

    it('should not change anything if item is not presented in $sttrs', () => {
      widget.attributeChangedCallback('other', 'old', 'new');
      expect(widget.$state.other).toBeUndefined();
    });
  });
});