//@ts-ignore
import { deepStrictEqual } from "assert/strict";
import {
  codeGenerator,
  compiler,
  parser,
  tokenizer,
  transformer,
} from "./the-super-tiny-compiler";

const input = "(add 2 (subtract 4 2))";
const output = "add(2, subtract(4, 2));";

const tokens = [
  { type: "PAREN", value: "(" },
  { type: "NAME", value: "add" },
  { type: "NUMBER", value: "2" },
  { type: "PAREN", value: "(" },
  { type: "NAME", value: "subtract" },
  { type: "NUMBER", value: "4" },
  { type: "NUMBER", value: "2" },
  { type: "PAREN", value: ")" },
  { type: "PAREN", value: ")" },
];

const ast = {
  type: "Program",
  body: [
    {
      type: "CallExpression",
      NAME: "add",
      params: [
        {
          type: "NumberLiteral",
          value: "2",
        },
        {
          type: "CallExpression",
          NAME: "subtract",
          params: [
            {
              type: "NumberLiteral",
              value: "4",
            },
            {
              type: "NumberLiteral",
              value: "2",
            },
          ],
        },
      ],
    },
  ],
};

const newAst = {
  type: "Program",
  body: [
    {
      type: "ExpressionStatement",
      expression: {
        type: "CallExpression",
        callee: {
          type: "Identifier",
          NAME: "add",
        },
        arguments: [
          {
            type: "NumberLiteral",
            value: "2",
          },
          {
            type: "CallExpression",
            callee: {
              type: "Identifier",
              NAME: "subtract",
            },
            arguments: [
              {
                type: "NumberLiteral",
                value: "4",
              },
              {
                type: "NumberLiteral",
                value: "2",
              },
            ],
          },
        ],
      },
    },
  ],
};
deepStrictEqual(
  tokenizer(input),
  tokens,
  "Tokenizer should turn `input` string into `tokens` array"
);
deepStrictEqual(
  parser(tokenizer(input)),
  ast,
  "Parser should turn `tokens` array into `ast`"
);
deepStrictEqual(
  transformer(parser(tokenizer(input))),
  newAst,
  "Transformer should turn `ast` into a `newAst`"
);
// console.log(codeGenerator(transformer(parser(tokenizer(input)))),output);
deepStrictEqual(
  codeGenerator(transformer(parser(tokenizer(input)))),
  output,
  "Code Generator should turn `newAst` into `output` string"
);

// console.log(compiler(
//     '(contact "张三" (contact "李四" "王五" (contact "李四" "王五" (contact "李四" "王五"))))'
//   ));
deepStrictEqual(
  compiler(
    '(contact "张三" (contact "李四" "王五" (contact "李四" "王五" (contact "李四" "王五"))))'
  ),
  'contact("张三", contact("李四", "王五", contact("李四", "王五", contact("李四", "王五"))));',
  "Compiler should turn `input` into `output`"
);

// console.log(JSON.stringify(transformer(parser(tokenizer(input)))));
