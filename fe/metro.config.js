const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Fix for packages like uuid using "dist/esm-browser"
config.resolver.alias = {
  ...(config.resolver.alias || {}),
  uuid: require.resolve("uuid"), // Alias to root-level uuid
};

// Add polyfills for Node.js modules
config.resolver.extraNodeModules = {
  crypto: require.resolve("expo-crypto"),
  stream: require.resolve("readable-stream"),
  util: require.resolve("util/"),
  buffer: require.resolve("buffer/"),
  process: require.resolve("process/browser"),
  zlib: require.resolve("browserify-zlib"),
  http: require.resolve("stream-http"),
  https: require.resolve("https-browserify"),
  assert: require.resolve("assert/"),
  url: require.resolve("url/"),
};

// Add the polyfills to the resolver
config.resolver.sourceExts = [...config.resolver.sourceExts, "mjs", "cjs"];

module.exports = config;
