const colors = require('colors');
// const loaderUtils = require('loader-utils') 不需要这个工具了
module.exports = function (source) {
    //@ts-ignore
    const options = { ...{ a: 11 }, ...this.getOptions() }
    console.log('my-loader'.green, options, source);
    // 对源代码进行处理
    const processedSource = source.replace(/\bHello\b/g, 'Hi');
    // 返回处理后的源代码
    return `console.log('${processedSource}')`;


    // // 通过 this.callback 告诉 Webpack 返回的结果
    // this.callback(
    //     // 当无法转换原内容时，给 Webpack 返回一个 Error
    //     err: Error | null,
    //     // 原内容转换后的内容
    //     content: string | Buffer,
    //     // 用于把转换后的内容得出原内容的 Source Map，方便调试
    //     sourceMap ?: SourceMap,
    //     // 如果本次转换为原内容生成了 AST 语法树，可以把这个 AST 返回，
    //     // 以方便之后需要 AST 的 Loader 复用该 AST，以避免重复生成 AST，提升性能
    //     abstractSyntaxTree ?: AST
    // );
    // // 当你使用 this.callback 返回内容时，该 Loader 必须返回 undefined，
    // // 以让 Webpack 知道该 Loader 返回的结果在 this.callback 中，而不是 return 中 
    // return;

};