import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';

import { defineExtensionConfig } from './index';

jest.mock('./flatten-html-pages-directory', () => 'flattenHtmlPagesDirectoryPluginStub');

jest.mock('node:url', () => ({
  fileURLToPath: jest.fn().mockReturnValue('urlFileUrlToPathStub'),
}));

jest.mock('node:fs', () => ({
  readdirSync: jest.fn().mockReturnValue(['fsReaddirSyncStub']),
}));

jest.mock('node:path', () => ({
  resolve: jest.fn().mockReturnValue('pathResolveStub'),
}));

describe('#defineExtensionConfig function', () => {
  let result;

  describe('required options', () => {
    it.each([
      // expectedErrorMessage, config
      [
        '"srcDir" is required',
        {
          srcDir: undefined,
          srcUrl: 'bar',
          outputDir: 'baz',
          vuePlugin: 'qux',
        },
      ],
      [
        '"srcUrl" is required',
        {
          srcDir: 'foo',
          srcUrl: undefined,
          outputDir: 'baz',
          vuePlugin: 'qux',
        },
      ],
      [
        '"outputDir" is required',
        {
          srcDir: 'foo',
          srcUrl: 'bar',
          outputDir: undefined,
          vuePlugin: 'qux',
        },
      ],
      [
        '"vuePlugin" is required',
        {
          srcDir: 'foo',
          srcUrl: 'bar',
          outputDir: 'baz',
          vuePlugin: undefined,
        },
      ],
    ])('throws an error with the message %s if config=%o', (expectedErrorMessage, config) => {
      let error;

      try {
        defineExtensionConfig(config);
      } catch (e) {
        error = e;
      }

      expect(error.message).toEqual(expectedErrorMessage);
    });
  });

  it('returns the base config', () => {
    const config = {
      srcDir: '/my/source/dir',
      srcUrl: 'file://my/source/dir',
      outputDir: '/my/output/dir',
      vuePlugin: { name: 'vuepluginstub' },
    };

    result = defineExtensionConfig(config);

    expect(result).toEqual({
      resolve: {
        alias: {
          '~': 'urlFileUrlToPathStub',
        },
      },
      plugins: [{ name: 'vuepluginstub' }, 'flattenHtmlPagesDirectoryPluginStub'],
      root: '/my/source/dir',
      base: '/static',
      build: {
        outDir: '/my/output/dir',
        emptyOutDir: true,
        rollupOptions: {
          input: {
            fsReaddirSyncStub: 'pathResolveStub',
          },
          output: {
            format: 'es',
            dir: '/my/output/dir',
            manualChunks: expect.any(Function),
          },
        },
      },
    });
  });

  it('returns the base config merged with a custom Vite config', () => {
    const config = {
      srcDir: '/my/source/dir',
      srcUrl: 'file://my/source/dir',
      outputDir: '/my/output/dir',
      vuePlugin: { name: 'vuepluginstub' },
    };

    const customViteConfig = {
      foo: 'bar',
      resolve: {
        one: 'two',
        alias: {
          '@': '/some/path',
        },
      },
      plugins: ['other-vite-plugin'],
      build: {
        someProperty: 'someValue',
        rollupOptions: {
          bar: 'baz',
          output: {
            baz: 'qux',
          },
        },
      },
    };

    result = defineExtensionConfig(config, customViteConfig);

    expect(result).toEqual({
      foo: 'bar',
      resolve: {
        one: 'two',
        alias: {
          '~': 'urlFileUrlToPathStub',
          '@': '/some/path',
        },
      },
      plugins: [
        { name: 'vuepluginstub' },
        'flattenHtmlPagesDirectoryPluginStub',
        'other-vite-plugin',
      ],
      root: '/my/source/dir',
      base: '/static',
      build: {
        someProperty: 'someValue',
        outDir: '/my/output/dir',
        emptyOutDir: true,
        rollupOptions: {
          bar: 'baz',
          input: {
            fsReaddirSyncStub: 'pathResolveStub',
          },
          output: {
            baz: 'qux',
            format: 'es',
            dir: '/my/output/dir',
            manualChunks: expect.any(Function),
          },
        },
      },
    });
  });

  it('does proper input entrypoints resolution', () => {
    const config = {
      srcDir: '/my/source/dir',
      srcUrl: 'file://my/source/dir',
      outputDir: '/my/output/dir',
      vuePlugin: { name: 'vuepluginstub' },
    };

    result = defineExtensionConfig(config);

    expect(resolve).toHaveBeenCalledWith('/my/source/dir', 'pages');
    expect(readdirSync).toHaveBeenCalledWith('pathResolveStub');
    expect(resolve).toHaveBeenCalledWith(
      '/my/source/dir',
      'pages/',
      'fsReaddirSyncStub',
      'index.html',
    );
    expect(result.build.rollupOptions.input).toEqual({
      fsReaddirSyncStub: 'pathResolveStub',
    });
  });

  describe('#config.build.rollupOptions.output.manualChunks', () => {
    it.each([
      // expected, moduleId
      ['connect', 'foo/bar/@cloudblueconnect/material-svg/baseline/googlePhoneBaseline.svg'],
      ['connect', 'foo/bar/@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin.js'],
      ['connect', 'node_modules/@cloudblueconnect/connect-ui-toolkit/index.js'],
      ['vendor', 'node_modules/@cloudgreendisconnect/disconnect-backend-toolkit/index.js'],
      ['vendor', 'node_modules/vue/index.js'],
      ['vendor', 'foo/bar/baz/node_modules/vuex/index.js'],
      [undefined, 'foo/bar/baz/index.js'],
      [undefined, 'main.css'],
    ])('returns %s if the module id=%s', (expected, moduleId) => {
      const config = {
        srcDir: '/my/source/dir',
        srcUrl: 'file://my/source/dir',
        outputDir: '/my/output/dir',
        vuePlugin: { name: 'vuepluginstub' },
      };
      const manualChunksFn = defineExtensionConfig(config).build.rollupOptions.output.manualChunks;

      result = manualChunksFn(moduleId);

      expect(result).toEqual(expected);
    });
  });
});
