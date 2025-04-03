English | [简体中文](./README_ZH-CN.md)

# minier - Automatic Static File Compressor

minier is a ready-to-use automated source code minification and compression tool. It behaves similarly to a JavaScript ESM bundler but preserves the original development directory's file structure and path hierarchy in the output directory.





## Install

```sh
npm install -D minier
```

Alternatively, use a global install, which will get minier.config.json from the directory where the minier command was run, along with relative paths to the input and output directories.

```sh
npm install -g minier
```

### Build command

```sh
minier build
```





## Use ESM

```js
import minier from 'minier';

minier({
    baseDir: "src/",
    outDir: "miniout/"
    /* ... */
});
```





## Default behaviours

- Takes files from the src/ directory and outputs them compressed to the miniout/ directory.

- Support .html / .htm / .css / .js / .mjs / .json / .xml / .svg files





## Configurations

> [!WARNING]
> **When baseDir and outDir are the same, minier creates a temporary directory as outDir, which is deleted as soon as it completes its mission, and the files in baseDir are overwritten.**

Whether in minier.config.json or using the ESM approach, their configuration items are the same.

### outDir

Specify the output directory to which the compressed production files will be output.

`String` `config.outDir || "miniout/"`

```json
{
    "outDir": "example-output-folder/"
}
```

### baseDir

Specify the input directory from which files to be processed before compression will be read.

`String` `config.baseDir || "src/"`

```json
{
    "baseDir": "example-input-folder/"
}
```

### ignore

Ignore directories or files from baseDir, they are not counted in the file total and are copied directly to the output directory.

`Array` `config.ignorePaths || []`

- `*`：Matches any number of characters, excluding the path separator (/)
- `**`：Matches any number of characters, including path separators (for recursive matching).

```json
{
    "ignorePaths": [
        "node_modules/**",
        "dir/**",
        "sub/dir/**",
        "**/*.mjs"
    ]
}
```

### cleanOutDir

Empty the output folder before outputting.

`Boolean` `config.cleanOutDir || true`

```json
{
    "cleanOutDir": false
}
```

### html.minifyCSS

Also compresses the `<style>` tag.

`Boolean` `config.html.minifyCSS || true`

```json
{
    "html": {
        "minifyCSS": false
    }
}
```

### html.minifyJS

Also compresses `<script>` tags.

`Boolean` `config.html.minifyJS || true`

```json
{
    "html": {
        "minifyJS": false
    }
}
```

### html.noMinifyInlineStyles

No longer compresses inline styles in `style=""`.

`Boolean` `config.html.noMinifyInlineStyles || true`

```json
{
    "html": {
        "noMinifyInlineStyles": false
    }
}
```

## js.noSpaces

Removes two consecutive spaces from &lt;script&gt; tags, .js and .mjs files, for template strings with indentation and newlines.

`Boolean` `config.js.noSpaces || false`

- Relatively aggressive configuration items.

```js
{
    js: {
        noSpaces: true
    }
}
```





## Configuration inheritance

### htmlTerser

[html-minifier-terser](https://github.com/terser/html-minifier-terser)'s Full Configuration Item Method.

This affects .html and .htm files.

```js
{
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
    }
}
```

### cleanCSS

[CleanCSS](https://github.com/clean-css/clean-css)'s Full Configuration Item Method.

This affects &lt;style&gt; tags and .css files.

```js
{
    cleanCSS: {
        level: 1,
        compatibility: "*",
        format: false,
        inline: false,
        ...config.cleanCSS
    }
}
```

### terser

The compress method for [terser](https://github.com/terser/terser).

This affects the &lt;script&gt; tag, .js and .mjs files.

```js
{
    terser: {
        compress: {
            dead_code: true,
            drop_console: false,
            ...config.terser.compress
        }
    }
}
```

### xmlMinify

[minify-xml](https://github.com/kristian/minify-xml)'s Full Configuration Item Method.

This affects .svg and .xml files.

```js
{
    xmlMinify: {
        removeComments: true,
        removeWhitespaceBetweenTags: true,
        ...config.xmlMinify
    }
}
```
