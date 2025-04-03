简体中文 | [English](./README.md)

# minier - 全自动静态文件压缩器

minier 是一个零配置可用的自动化源代码最小化压缩器。其行为类似于 JavaScript ESM 打包器，但会在输出目录保持开发目录的文件结构和路径。





## 安装

```sh
npm install -D minier
```

或者使用全局安装，全局安装方式将会从运行 minier 命令的目录中获取 minier.config.json 和相对路径的输入输出目录。

```sh
npm install -g minier
```

### 构建命令

```sh
minier build
```





## 使用 ESM

```js
import minier from 'minier';

minier({
    baseDir: "src/",
    outDir: "miniout/"
    /* ... */
});
```





## 默认行为

- 从 src/ 目录获取文件，并将它们压缩后输出到 miniout/ 目录。

- 支持 .html / .htm / .css / .js / .mjs / .json / .xml / .svg 文件。





## 配置

> [!WARNING]
> **当 baseDir 和 outDir 相同时， minier 会创建一个临时目录作为 outDir ，临时目录会在完成使命后立即删除，baseDir 中的文件将会被覆盖。**

不论是在 minier.config.json 中还是使用 ESM 的方式，它们的配置项是一致的。

### outDir

指定输出目录，压缩完成的生产文件将会输出到该目录。

`String` `config.outDir || "miniout/"`

```json
{
    "outDir": "example-output-folder/"
}
```

### baseDir

指定输入目录，压缩前需要处理的文件将会从该目录读取。

`String` `config.baseDir || "src/"`

```json
{
    "baseDir": "example-input-folder/"
}
```

### ignore

基于 baseDir 忽略目录或文件，不计入文件总数，直接复制到输出目录。

`Array` `config.ignorePaths || []`

- `*`：匹配任意数量的字符，但不包括路径分隔符 (/)
- `**`：匹配任意数量的字符，包括路径分隔符 (用于递归匹配)

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

输出前先清空输出文件夹。

`Boolean` `config.cleanOutDir || true`

```json
{
    "cleanOutDir": false
}
```

### html.minifyCSS

同时压缩 `<style>` 标签。

`Boolean` `config.html.minifyCSS || true`

```json
{
    "html": {
        "minifyCSS": false
    }
}
```

### html.minifyJS

同时压缩 `<script>` 标签。

`Boolean` `config.html.minifyJS || true`

```json
{
    "html": {
        "minifyJS": false
    }
}
```

### html.noMinifyInlineStyles

不再压缩 `style=""` 中的内联样式。

`Boolean` `config.html.noMinifyInlineStyles || true`

```json
{
    "html": {
        "noMinifyInlineStyles": false
    }
}
```

## js.noSpaces

删除 &lt;script&gt; 标签、 .js 和 .mjs 文件中两个连续的空格，适用于具有缩进和换行的模板字符串。

`Boolean` `config.js.noSpaces || false`

- 相对激进的配置项。

```js
{
    js: {
        noSpaces: true
    }
}
```





## 配置继承

### htmlTerser

[html-minifier-terser](https://github.com/terser/html-minifier-terser) 的全部配置项方法。

这会影响 .html 和 .htm 文件。

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

[CleanCSS](https://github.com/clean-css/clean-css) 的全部配置项方法。

这会影响 &lt;style&gt; 标签和 .css 文件。

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

[terser](https://github.com/terser/terser) 的 compress 配置项方法。

这会影响 &lt;script&gt; 标签、 .js 和 .mjs 文件。

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

[minify-xml](https://github.com/kristian/minify-xml) 的全部配置项方法。

这会影响 .svg 和 .xml 文件。

```js
{
    xmlMinify: {
        removeComments: true,
        removeWhitespaceBetweenTags: true,
        ...config.xmlMinify
    }
}
```
