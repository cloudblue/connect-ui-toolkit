import widgetFactory from './widgetFactory';

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
  hex: jest.fn(() => 'aaaaaaaa'),
}))

describe('widgetFactory', () => {
  let Widget;
  let shadow;
  let boilerContentPlaceholder;
  let widget;
  let plugin;
  let pluginWatch;
  let pluginMount;
  let pluginUnmount;
  let component;
  let storeInstaller;
  let settings;

  beforeEach(() => {
    boilerContentPlaceholder = {
      replaceWith: jest.fn(),
    };

    shadow = {
      querySelector: jest.fn(() => boilerContentPlaceholder),
      appendChild: jest.fn(),
      getElementById: jest.fn(() => null),
    };

    global.HTMLElement = class {
      constructor() {
        this.attachShadow = jest.fn(() => shadow);
      }
    };

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

    describe('patch styles', () => {
      let styleElement;

      beforeEach(() => {
        styleElement = {
          foo: 'bar',
          append: jest.fn(),
          setAttribute: jest.fn(),
          appendChild: jest.fn(),
        };

        global.document.createElement = jest.fn(() => styleElement);
        widget.css = jest.fn(() => 'foo');
        widget.connectedCallback();
      });

      it('should create style node', () => {
        expect(document.createElement).toHaveBeenCalledWith('style');
      });

      it('should take given styles', () => {
        expect(widget.css).toHaveBeenCalled();
      });

      it('should place given css to "style" node', () => {
        expect(styleElement.append).toHaveBeenCalledWith('foo');
      });

      it('should paste created style node to shadow', () => {
        expect(widget.$shadow.appendChild.mock.calls[0][0]).toEqual(expect.objectContaining({ foo: 'bar' }));
      });
    });

    describe('place container', () => {
      let styleElement;

      beforeEach(() => {
        styleElement = {
          cloneNode: jest.fn(() => 'foo'),
        };

        global.document.querySelectorAll = jest.fn(() => [styleElement]);
        widget.connectedCallback();
      });

      it('should paste copied node to shadow DOM zone', () => {
        widget.$container = {
          appendChild: jest.fn(),
        };

        widget.$slot = 'foo';

        widget.connectedCallback();

        expect(widget.$container.appendChild).toHaveBeenCalledWith('foo');
      });

      it('should place container node', () => {
        widget.$container = {
          foo: 'bar',
          appendChild: jest.fn(),
        };

        widget.connectedCallback();

        expect(widget.$shadow.appendChild.mock.calls[3][0]).toEqual(
          expect.objectContaining({ foo: 'bar' }),
        );
      });
    });

    describe('restore slot of deleted', () => {
      beforeEach(() => {
        widget.$container = { appendChild: jest.fn() };
        widget.$slot = 'foo';
      });

      it('should replace "boliler-content" element with a slot', () => {
        widget.connectedCallback();
        expect(boilerContentPlaceholder.replaceWith).toHaveBeenCalledWith('foo');
      });

      it('should do nothing if slot is still there', () => {
        shadow.getElementById = jest.fn(() => 'foo');
        widget.connectedCallback();
        expect(boilerContentPlaceholder.replaceWith).not.toHaveBeenCalled();
      });


      it('should do nothing if placeholder is not there', () => {
        shadow.querySelector = jest.fn(() => null);
        widget.connectedCallback();
        expect(boilerContentPlaceholder.replaceWith).not.toHaveBeenCalled();
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
