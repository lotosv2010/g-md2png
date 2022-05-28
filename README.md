# g-md2png

Markdown 文档到 PNG 图片转换工具

## Install

```shell
pnpm add -g g-md2png
```

## config

- 新增一个 .md2pngrc 文件配置自己的 html 模板
- 案例

```html
template: >
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="https://unpkg.com/github-markdown-css">
    <style>
      .markdown-body {
        color: red;
        width: 90%;
        max-width: 700px;
        margin: 0 auto;
      }
    </style>
  </head>
  <body class="markdown-body">
    ${fragment}
  </body>
  </html>
```

## Usage

```shell
g-md2png README.md -O output.png -W 800

# 或

g-md2png README.md
? 请输出图片文件路径? … readme.png
? 请输出图片宽度? › 1000
```
