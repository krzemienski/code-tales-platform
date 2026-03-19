const plugin = () => {
  return {
    postcssPlugin: 'fix-mask-urls',
    Declaration(decl) {
      if (
        (decl.prop === 'mask-image' || decl.prop === '-webkit-mask-image') &&
        decl.value.includes("url(...)")
      ) {
        decl.value = decl.value.replace(
          /url\(\.\.\.\)/g,
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E\")"
        );
      }
    },
  };
};
plugin.postcss = true;
module.exports = plugin;
