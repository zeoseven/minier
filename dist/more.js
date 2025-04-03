export const initConfig = (config) => {
  return {

    baseDir: config.baseDir || 'src/',

    outDir: config.outDir || 'miniout/',

    ignore: config.ignore || [],

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


