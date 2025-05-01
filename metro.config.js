const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

// Get default configuration
const config = getDefaultConfig(__dirname);

// Add resolver for Node.js modules
config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    stream: require.resolve('stream-browserify'),
    crypto: require.resolve('react-native-crypto'),
    http: require.resolve('@tradle/react-native-http'),
    https: require.resolve('https-browserify'),
    os: require.resolve('react-native-os'),
    path: require.resolve('path-browserify'),
    fs: require.resolve('react-native-level-fs'),
    net: require.resolve('react-native-tcp'),
    tls: require.resolve('react-native-tcp'),
    zlib: require.resolve('browserify-zlib'),
  }
};

// Export the config with NativeWind enabled
module.exports = withNativeWind(config, { input: './global.css' });