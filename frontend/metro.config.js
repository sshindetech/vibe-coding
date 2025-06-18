const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
 
const projectRoot = __dirname;

const config = getDefaultConfig(__dirname)
config.watchFolders = [projectRoot];
 
module.exports = withNativeWind(config, { input: './global.css' })