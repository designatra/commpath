module.exports = function (api) {
  api.cache(true);

  const presets = ["env"];
  const plugins = [
    "@babel/plugin-syntax-dynamic-import"
  ];

  return {
    presets,
    plugins
  };
}
