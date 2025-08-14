module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            // Required for expo-router
            require.resolve("expo-router/babel"),
            // NativeWind configuration  
            "nativewind/babel",
            // Modern transform plugins to override deprecated proposal plugins
            "@babel/plugin-transform-class-properties",
            "@babel/plugin-transform-nullish-coalescing-operator",
            "@babel/plugin-transform-optional-chaining",
            // Reanimated plugin (must be last)
            "react-native-reanimated/plugin",
        ],
    };
};
