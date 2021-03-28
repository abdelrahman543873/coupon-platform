module.exports = {
  presets: [
    ["@babel/preset-env", { modules: false, targets: { node: "current" } }],
  ],
  plugins: [
    ["@babel/plugin-proposal-object-rest-spread"],
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    ["@babel/plugin-proposal-class-properties", { loose: true }],
  ],
};
