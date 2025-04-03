import { minify as htmlMinify } from 'html-minifier-terser';
import { minify as terser } from "terser";
import xmlMinify from 'minify-xml';
import CleanCSS from 'clean-css';

import fse from 'fs-extra';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { globSync } from 'glob';
import chalk from 'chalk';



async function core(config) {

  const vars = {
    startTime: Date.now(),
    outputNumber: 0,
    outDirIsBaseDir: false
  };

  const _cleanCSS = (i) => {
    try {
      const o = new CleanCSS({
        ...config.cleanCSS
      }).minify(i);
      return o;
    } catch (e) {
      return i;
    };
  };

  const _terser = async (i) => {
    try {
      let o = await terser(i, {
        compress: {
          ...config.terser.compress
        }
      });
      o = String(o.code);
      config.js.noSpaces && (o = o.replace(/ {2,}/g, ''));
      return o.trim() != "" ? o : i;
    } catch (e) {
      return i;
    };
  };

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  console.log(` `);
  console.log(
    chalk.bgBlue.white(`        minier ${JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8')).version}        `)
  );
  console.log(` `);

  function value(a, b) {
    return typeof a === 'undefined' || a == null ? b : a;
  };

  function funValue(a, b) {
    return a || typeof a === 'undefined' || a == null ? b : a;
  };



  const _outDir = config.outDir && config.outDir.replace("./", "");
  let outDir = _outDir.endsWith("/") ? _outDir : _outDir + "/";

  const _baseDir = config.baseDir && config.baseDir.replace("./", "");
  const baseDir = _baseDir.endsWith("/") ? _baseDir : _baseDir + "/";

  if (outDir == baseDir) {
    const temp = btoa && btoa(String(vars.startTime)).replace(/[\/+=]/g, '0').toLowerCase() || String(vars.startTime);
    outDir = `.minier/temp/${temp}/`;
    vars.outDirIsBaseDir = true;

    console.log(chalk.yellow(`    Warning: outDir == baseDir, The files in baseDir will be replaced.`));
  };



  // All Files
  const files = globSync('**/*', {
    cwd: baseDir,
    nodir: true,
    ignore: config.ignore
  })

  const OnFiles = files.filter(i => /\.(html|htm|css|mjs|js|json|xml|svg)$/i.test(i));

  if (OnFiles <= 0) {
    console.log(chalk.bgRed.white(`  There are no files in ${baseDir} or no directory for this.  `));
    console.log(` `);
    process.exit(0);
  } else {
    console.log(`    ${OnFiles.length} Files Found ...`);
    console.log(`    outDir == ${outDir}`);
    console.log(` `);
  };



  // Remove
  if (
    value(config.cleanOutDir, true)
  ) {
    try {
      fse.removeSync(outDir);
    } catch (e) { };
  };



  // Copy
  fse.copySync(baseDir, outDir);



  const output = (path, content) => {
    if (path && content) {
      vars.outputNumber++;
      fs.writeFileSync(path, content);
    };
    process.stdout.write(`    ${vars.outputNumber} / ${OnFiles.length}   \r`);
  }; output();



  for (const file of OnFiles) {



    // CSS
    if (file.endsWith('.css')) {
      const content = fs.readFileSync(baseDir + file, 'utf8');

      let result = null;
      try {
        result = _cleanCSS(content);
      } catch (e) {
        result = content;
      };

      result.sourceMap && fs.writeFileSync(outDir + file + ".map", JSON.stringify(result.sourceMap));
      output(outDir + file, result.styles);
    };



    // HTML
    if (file.endsWith('.html') || file.endsWith('.htm')) {
      const result = await htmlMinify(fs.readFileSync(baseDir + file, 'utf8'), {
        minifyJS: funValue(config.html.minifyJS, async (js) => {
          try {
            return await _terser(js);
          } catch {
            return js;
          };
        }),
        minifyCSS: funValue(config.html.minifyCSS, (css) => {
          try {
            const originCSS = css;
            const result = _cleanCSS(originCSS);
            if (config.html.noMinifyInlineStyles) {
              return result.styles.trim() != "" ? result.styles : originCSS;
            } else {
              return result.styles.trim() != "" ? result.styles : originCSS.replace(/\s*:\s*/g, ':').replace(/\s*;\s*/g, ';').trim();
            };
          } catch {
            return css;
          };
        }),
        ...config.htmlTerser
      });

      output(outDir + file, result);
    };



    // JS
    if (file.endsWith('.js') || file.endsWith('.mjs')) {
      const jsCode = fs.readFileSync(baseDir + file, 'utf8');

      let result = null;
      try {
        result = await _terser(jsCode);
      } catch (e) {
        result = jsCode;
      };

      output(outDir + file, result);
    };



    // JSON
    if (file.endsWith('.json')) {
      const jsonCode = fs.readFileSync(baseDir + file, 'utf8');

      let result = null;
      try {
        result = JSON.stringify(JSON.parse(jsonCode))
      } catch (e) {
        result = jsonCode;
      };

      output(outDir + file, result);
    };



    // XML / SVG
    if (file.endsWith('.xml') || file.endsWith('.svg')) {
      const xmlCode = fs.readFileSync(baseDir + file, 'utf8');

      let result = null;
      try {
        result = xmlMinify(xmlCode, {
          ...config.xmlMinify
        });
      } catch (e) {
        result = xmlCode;
      };

      output(outDir + file, result);
    };



  };



  if (vars.outDirIsBaseDir) {
    fse.removeSync(baseDir);
    fse.moveSync(outDir, baseDir);
    fse.removeSync(".minier/");
  };



  console.log(
    chalk.black(`✨ ${vars.outputNumber} Files Minified. (${((Date.now() - vars.startTime) / 1000).toFixed(3)}s)`)
  );
  console.log(` `);
};

export default core;