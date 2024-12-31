import { BlockStatement } from "./../../Vue/vue3-source-code/core/packages/compiler-core/src/ast";
// 箭头函数转普通函数(@babel/plugin-transform-arrow-functions)
// 1. 普通写法 const fn = (a,b)=>{return a+b}
// 2. 最简单写法 const fn = (a,b)=> a+b
// 3. this的设置 const fn = (a,b)=>{ console.log(this);return a+b;}

// https://astexplorer.net/  在这个网址可以查看代码对应的ast
import { transform, types } from "@babel/core";
// import PluginTransformArrowFuctions from "@babel/plugin-transform-arrow-functions";
const write1 = "const fn = (a,b)=>{return a+b}";
const write2 = "const fn = (a,b)=> a+b";
const write3 = "const fn = (a,b)=>{ console.log(this);return a+b;}";

export interface Options {
  spec?: boolean;
}
const PluginTransformArrowFuctions = (api, options: Options) => {
  return {
    name: "transform-arrow-functions",
    visitor: {
      ArrowFunctionExpression(path) {
        // 如果有const声明改成var

        // 给函数加上this
        // 1.找到非箭头函数的上下文
        const thisEnv = path.findParent((parent) => {
          return (
            (parent.isFunction() && !parent.isArrowFunctionExpression()) ||
            parent.isProgram()
          );
        });
        // 2.往上下文的作用域添加 var _this=this 声明
        thisEnv.scope.push({
          id: types.identifier("_this"),
          init: types.thisExpression(),
        });
        // 3.将子节点内的this使用替换成_this
        path.traverse({
          ThisExpression(thisPath) {
            thisPath.replaceWith(types.identifier("_this"));
          },
        });

        // 如果函数本身没有作用域则加上
        if (!types.isBlockStatement(path.node.body)) {
          path.node.body = types.blockStatement([
            types.returnStatement(path.node.body),
          ]);
        }
        // 将节点类型设置为函数类型节点
        path.node.type = "FunctionExpression";
      },
    },
  };
};
const test = () => {
  transform(
    write1,
    {
      plugins: [PluginTransformArrowFuctions],
    },
    function (err, result) {
      console.log(result?.code); //{ code, map, ast }
    }
  );
  transform(
    write2,
    { plugins: [PluginTransformArrowFuctions] },
    function (err, result) {
      console.log(result?.code); //{ code, map, ast }
    }
  );
  transform(
    write3,
    { plugins: [PluginTransformArrowFuctions] },
    function (err, result) {
      console.log(result?.code); //{ code, map, ast }
    }
  );
};
test();
