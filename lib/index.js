const prompts = require('prompts');
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const puppeteer = require('puppeteer');
const { cosmiconfigSync } = require('cosmiconfig');
const chalk = require('chalk');
const ora = require('ora');

const questions = [
  {
    type: 'text',
    name: 'output',
    message: '请输出图片文件路径?',
    initial: 'output.png',
  },
  {
    type: 'number',
    name: 'width',
    message: '请输出图片宽度?',
    initial: 1000,
  }
];

const confirm = async (input, options) => {
  let response = {};
  if(!options?.output || !options?.width) {
    response = await prompts(questions);
  }
  options = Object.assign({}, options, response);
  
  // 1.读取 input 文件所对应的文件内容
  // 相对路径指的是相对命令行当前所在目录：process.cwd()
  // 这个路径跟代码位置、node程序所在的位置都没有关系，只是看你运行这个js文件时所在文件目录
  // const filename = path.resolve(process.cwd(), input); // 等价下面语句 resolve 内部会默认 使用 process.cwd() 做绝对路径解析
  const filename = path.resolve(input);
  if(!fs.existsSync(filename)) {
    throw new Error('文件路径不存在');
  }
  const stat = fs.statSync(filename);
  if(stat.isDirectory()) {
    throw new Error('给定路径不是一个文件');
  }
  // loading效果
  options = Object.assign({output: 'output.png', width: 1000}, options);
  const spinner = ora({
    text: chalk.yellow('markdown 转换 png 中，请稍等....'),
    color: 'yellow'
  }).start();
  const contents = fs.readFileSync(filename, 'utf8');
  // 2.使用 marked 将 markdown 转换为 html
  const fragment = marked(contents)

  // 加载配置文件中的模版
  const explorer = cosmiconfigSync('md2png');
  const { config = {} } = explorer.search(process.cwd()) || {};

  const html = config?.template?.replace('${fragment}', fragment);
  // 3.html -> 图片
  // 无头浏览器技术
  // console.log(html)
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // await page.goto('https://www.lagou.com');
  const { width, output } = options;
  await page.setViewport({ width: +width, height: 100 });
  await page.setContent(html ?? fragment);
  await page.screenshot({ path: output, fullPage: true });
  await browser.close();
  console.log(chalk.greenBright(`\r\n✅MD转换图片完成，路径为：${output}`));
  spinner.stop();
}

/**
 * 指定路径的 md 文件转换为 png
 * @param {string} input 输入文件路径（可能是相对路径，也可能是绝对路径）
 * @param {object} options 配置项 
 * @returns 
 */
module.exports = function(input, options) {
  if(typeof input !== 'string') {
    throw new TypeError(`Expected a string, got ${typeof input}`);
  }
  confirm(input, options);
  // return options;
}



