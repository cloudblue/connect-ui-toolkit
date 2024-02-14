export default {
  // Custom plugin to flatten the output directory structure for the extension pages
  // Vite does not respect the name given to the input file (see https://vitejs.dev/guide/build.html#multi-page-app)
  // for decent reasons, but these reasons do not apply to Connect Extensions, as they are not run on dev mode.
  // See https://stackoverflow.com/a/77096400 for more info on this solution
  name: 'flatten-html-pages-directory',
  enforce: 'post',
  generateBundle(_, bundle) {
    Object.values(bundle).forEach((outputItem) => {
      if (outputItem.fileName.endsWith('.html')) {
        const pageName = outputItem.fileName.match(/([\w\-_]+)\/index\.html/)[1];
        outputItem.fileName = `${pageName}.html`;
      }
    });
  },
}
