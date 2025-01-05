const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const os = require('os');

// 获取CPU信息数组
const cpusInfo = os.cpus();

// CPU核心数即为cpusInfo数组的长度
const cpuCoreCount = cpusInfo.length;

// console.log(`CPU核心数: ${cpuCoreCount}`);


/** entry 文件path */
const entryPath = path.join(__dirname, "../src/index.tsx");
/** 输出文件路径 */
const outputPath = path.join(__dirname, "../dist");
/** 根html路径 */
const htmlPath = path.join(__dirname, "../public/index.html");

const config = {
  entry: entryPath, // 入口文件
  output: {
    filename: "static/js/[name].js", // 每个输出js的名称
    path: outputPath, // 打包结果输出路径
    clean: true, // webpack4需要配置clean-webpack-plugin来删除dist文件,webpack5内置了
    publicPath: "/", // 打包后文件的公共前缀路径
    assetModuleFilename: "images/[hash][ext][query]", //处理后的图片文件输出路径
  },
  cache: {
    type: 'filesystem', // 使用文件缓存 这个
  },
  module: {
    rules: [
      /** js代码 */
      {
        test: /\.(ts|tsx|js|jsx)$/, //匹配这四种文件
        exclude: /node_modules/,// 排除node_modules目录
        use: [
          {
            loader: "thread-loader",
            options: {
              workers: cpuCoreCount, // 设置子进程数量，通常设置为CPU核心数
              poolTimeout: 2000, // 设置子进程空闲超时时间（毫秒）
            },
          },
          {
            loader: "babel-loader",
            options: {
              // 预设执行顺序由右往左,所以先处理ts,再处理jsx
              presets: [
                "@babel/preset-react",
                "@babel/preset-typescript",
                "@babel/preset-env",
              ],
            },
          },
        ],
      },
      /** 样式 */
      {
        test: /\.(less|css)/, //匹配less 和 css
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: {
                auto: true,
                localIdentName: "[path][name]_[local]",
              },
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  [
                    "postcss-preset-env",
                    {
                      // 配置选项，如目标浏览器、CSS特性阶段等
                      stage: 3, // 选择要启用的CSS提案阶段，默认为2
                      browsers: "last 2 versions", // 指定目标浏览器列表，可以使用Browserslist查询语法
                      // 其他可选配置...
                    },
                  ],
                ],
              },
            },
          },
          "less-loader",
        ],
      },
      /** 图片素材 */
      {
        test: /\.(png|jpg|gif)$/i,
        type: "asset", // asset/resource 文件， asset/inline 行间链接(base64),asset自动根据size判断,
        parser: {
          /** data url的限制条件 */
          dataUrlCondition: {
            maxSize: 4 * 1024, // 4kb 设置生成base64还是文件的尺寸限制
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"], //运行import这四种类型的文件时可以省略后缀名
    alias: {
      "@": path.resolve(__dirname, "../src"),
    },
    modules: ["node_modules"],
  },
  plugins: [
    // 将打包后的js文件引入代码插入到目标模板html文件中
    new HtmlWebpackPlugin({
      template: htmlPath, // 模板取定义root节点的模板
      inject: true, // 自动注入静态资源
    }),
    // 将 CSS 提取到单独的文件中，为每个包含 CSS 的 JS 文件创建一个 CSS 文件，并且支持 CSS 和 SourceMaps 的按需加载
    new MiniCssExtractPlugin({
      filename: "static/css/[name].css",
    }),
  ],
  // 其他 webpack 配置...
};

module.exports = config;
