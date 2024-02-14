import flattenHtmlPagesDirectory from './flatten-html-pages-directory';


describe('#flattenHtmlPagesDirectory vite plugin', () => {
  it('exposes the correct properties', () => {
    expect(flattenHtmlPagesDirectory).toEqual(expect.objectContaining({
      name: 'flatten-html-pages-directory',
      enforce: 'post',
      generateBundle: expect.any(Function),
    }));
  });

  describe('generateBundle function', () => {
    it('changes the fileName of items that are html files and leaves the rest as they are', () => {
      const bundle = {
        foo: { fileName: 'one/two/index.js', id: 'foo' },
        bar: { fileName: 'three/four/index.html', id: 'bar' },
        baz: { fileName: 'five/six/index.css', id: 'baz' },
      };

      flattenHtmlPagesDirectory.generateBundle(null, bundle);

      expect(bundle).toEqual({
        foo: { fileName: 'one/two/index.js', id: 'foo' },
        bar: { fileName: 'four.html', id: 'bar' },
        baz: { fileName: 'five/six/index.css', id: 'baz' },
      });
    });
  });
});
