#! /usr/bin/env node

// CLI 入口的作用
//  1.解析 CLI 参数 process.argv
//  2.调用模块中的功能实现

const { program } = require('commander');
const pkg = require('../package.json');
const md2Png = require('..');


program
  .version(pkg.version)
  .usage('<input>') // 用户传递过来的 md 文件路径
  .option('-O, --output <output>', '输出图片文件路径')
  .option('-W, --width <output>', '输出图片宽度')
  .on('--help', console.log)
  .parse(process.argv)
  .args.length || program.help(); // 如果没有传递文件路径，就调用 help 命令

const { args } = program;
// 文件路径
const [ input ] = args;
// option: flag 参数
const options = program.opts();
// 调用模块
md2Png(input, options);
