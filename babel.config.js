const presets = [
  [
    "@babel/env",
    {
      targets: {
        edge: "10",
        firefox: "21",
        chrome: "23",
        safari: "6"
      },
      useBuiltIns: "usage",
    },
  ],
];

module.exports = { presets }; 