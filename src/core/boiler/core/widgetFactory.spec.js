import widgetFactory from './widgetFactory';

import boilerInterface from './boilerInterface';

import {
  $updateAttribute,
} from './helpers';


jest.mock('./boilerInterface', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('./helpers', () => ({
  noop: jest.fn(),
  $updateAttribute: jest.fn(),
}))

describe('widgetFactory', () => {
  let Widget;
  let widget;
  let plugin;
  let pluginWatch;
  let pluginMount;
  let pluginUnmount;
  let component;
  let storeInstaller;
  let settings;

  beforeEach(() => {
    global.HTMLElement = class {};

    pluginWatch = jest.fn();
    pluginMount = jest.fn();
    pluginUnmount = jest.fn();

    plugin = {
      observe: jest.fn(() => ['foo', 'bar']),
      create: jest.fn(() => ({
        watch: pluginWatch,
        mount: pluginMount,
        unmount: pluginUnmount,
      })),
    }

    settings = { foo: 'bar' };

    Widget = widgetFactory(plugin, component, storeInstaller, settings);
    widget = new Widget();

    widget.addEventListener = jest.fn();
  });

  describe('constructor', () => {
    it('should set $app to null', () => {
      expect(widget.$app).toBe(null);
    });

    it('should preserve passed settings', () => {
      expect(widget.$settings).toEqual({ foo: 'bar' });
    });

    it('should set plugin.mount as #.mount', () => {
      widget.mount();
      expect(pluginMount).toHaveBeenCalled();
    });

    it('should set plugin.unmount as #.unmount', () => {
      widget.unmount();
      expect(pluginUnmount).toHaveBeenCalled();
    });

    it('should set plugin.watch as #.watch', () => {
      widget.watch();
      expect(pluginWatch).toHaveBeenCalled();
    });

    describe('defaults for methods', () => {
      beforeEach(() => {
        plugin = {
          create: jest.fn(() => ({})),
        };

        Widget = widgetFactory(plugin, component, storeInstaller, settings);
        widget = new Widget();
      });

      it('should set noop as default for watch but method still callable', () => {
        widget.watch();
        expect(pluginWatch).not.toHaveBeenCalled();
      });

      it('should set noop as default for mount but method still callable', () => {
        widget.mount();
        expect(pluginMount).not.toHaveBeenCalled();
      });

      it('should set noop as default for unmount but method still callable', () => {
        widget.unmount();
        expect(pluginUnmount).not.toHaveBeenCalled();
      });
    });
  });

  describe('#connectedCallback()', () => {
    it('should add listeners for each of observed props update events', () => {
      widget.connectedCallback();

      expect(widget.addEventListener.mock.calls).toEqual([
        ['update:foo', expect.any(Function)],
        ['update:bar', expect.any(Function)],
        ['update', expect.any(Function)],
      ]);
    });

    describe('update:attribute event callback', () => {
      let call;
      let callback;
      let attributeValue;

      beforeEach(() => {
        attributeValue = jest.fn();
        call = () => {
          widget.connectedCallback();
          widget.getAttribute = jest.fn(() => attributeValue);
          callback = widget.addEventListener.mock.calls[0][1];
          callback({ detail: 'bar' });
        };
      });

      it('should pick attribute value', () => {
        call();
        expect(widget.getAttribute).toHaveBeenCalledWith('onfoo');
      });

      it('should update corresponding attribute', () => {
        call();
        expect($updateAttribute).toHaveBeenCalledWith(widget, 'foo', 'bar');
      });

      it('should call handler with details passed if attr value is a function', () => {
        call();
        widget.connectedCallback();
        expect(attributeValue).toHaveBeenCalledWith('bar');
      });

      it('should accept js-string as attribute value', () => {
        global.Function = jest.fn().mockImplementation(() => () => jest.fn());
        attributeValue = '(v) => "foo:" + v';
        call();
        widget.connectedCallback();
        expect(Function).toHaveBeenCalledWith('return (v) => "foo:" + v');
      });

      it('should not fall  when attr is falsy', () => {
        let err;
        attributeValue = false;
        call();

        try {
          widget.connectedCallback();
        } catch (e) {
          err = e;
        }

        expect(err).toBeUndefined();
      });
    });

    describe('update event callback', () => {
      let call;
      let callback;
      let attributeValue;

      beforeEach(() => {
        attributeValue = jest.fn();
        call = () => {
          widget.connectedCallback();
          widget.getAttribute = jest.fn(() => attributeValue);
          callback = widget.addEventListener.mock.calls[2][1];
          callback({ detail: 'bar' });
        };
      });

      it('should pick attribute value', () => {
        call();
        expect(widget.getAttribute).toHaveBeenCalledWith('onUpdate');
      });

      it('should call handler with details passed if attr value is a function', () => {
        call();
        widget.connectedCallback();
        expect(attributeValue).toHaveBeenCalledWith('bar');
      });

      it('should accept js-string as attribute value', () => {
        global.Function = jest.fn().mockImplementation(() => () => jest.fn());
        attributeValue = '(v) => "foo:" + v';
        call();
        widget.connectedCallback();
        expect(Function).toHaveBeenCalledWith('return (v) => "foo:" + v');
      });

      it('should not fall  when attr is falsy', () => {
        let err;
        attributeValue = false;
        call();

        try {
          widget.connectedCallback();
        } catch (e) {
          err = e;
        }

        expect(err).toBeUndefined();
      });
    });
  });

  describe('#disconectedCallback()', () => {
    it('should call #.unmount() passing app as an argument', () => {
      widget.$app = 'APP';
      widget.unmount = jest.fn();

      widget.disconnectedCallback();

      expect(widget.unmount).toHaveBeenCalledWith('APP');
    });
  });

  describe('#observedAttributes', () => {
    it('should return result of plugin.observe if provided', () => {
      expect(Widget.observedAttributes).toEqual(['foo', 'bar']);
    });

    it('otherwise should return empty array', () => {
      plugin.observe = null;
      expect(Widget.observedAttributes).toEqual([]);
    });
  });

  describe('#attributeChangedCallback()', () => {
    beforeEach(() => {
      widget.watch = jest.fn();
    });

    it('should do nothing when no plugin.observe provided', () => {
      plugin.observe = null;
      widget.attributeChangedCallback('foo', 'bar');
      expect(widget.watch).not.toHaveBeenCalled();
    });

    it('should do nothing if changing attribute is not in observed list', () => {
      widget.attributeChangedCallback('buz', 'bar');
      expect(widget.watch).not.toHaveBeenCalled();
    });

    it('should call #watch when attribute is in an observed list', () => {
      widget.attributeChangedCallback('foo', 'bar', 'buz');
      expect(widget.watch).toHaveBeenCalledWith('foo', 'buz', 'bar');
    });
  });
});
