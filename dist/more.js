export const initConfig = (config) => {

  function value(i, d) {
    return typeof i == "undefined" ? d : i;
  };

  return {

    baseDir: config.baseDir || 'src/',

    outDir: config.outDir || 'release/',

    ignore: config.ignore || [],

    cleanOutDir: value(config.cleanOutDir, false),

    html: {
      ...config.html
    },

    js: {
      noSpaces: false,
      ...config.js
    },

    htmlTerser: {
      caseSensitive: true,
      collapseBooleanAttributes: true,
      collapseWhitespace: true,
      conservativeCollapse: false,
      decodeEntities: false,
      html5: true,
      removeComments: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: false,
      removeStyleLinkTypeAttributes: false,
      keepClosingSlash: true,
      ...config.htmlTerser
    },

    cleanCSS: {
      level: 1,
      compatibility: "*",
      format: false,
      inline: false,
      ...config.cleanCSS
    },

    terser: {
      compress: {
        dead_code: true,
        drop_console: false,
        ...config.terserCompress
      }
    },

    xmlMinify: {
      removeComments: true,
      removeWhitespaceBetweenTags: true,
      ...config.xmlMinify
    }

  };
};


