/**
 * 简易编译器
 * 输入 (add 2 2)
 * 输出 add(2, 2)
 * 输入 (subtract 4 2)
 * 输出 subtract(4, 2)
 * 输入 (contact "foo" "bar")
 * 输出 contact("foo", "bar")
 * 输入 (add 2 (subtract 4 2))
 * 输出 add(2, subtract(4, 2))
 */

/**
 * 定义了编译器中使用的 token 类型的枚举。
 *
 * @enum {string}
 * @readonly
 * @property {string} Number - 表示数字类型的 token。
 * @property {string} String - 表示字符串类型的 token。
 * @property {string} CallExpression - 表示调用表达式类型的 token。
 * @property {string} Name - 表示名称类型的 token，通常用于函数或变量名。
 * @property {string} Paren - 表示括号类型的 token，包括左括号和右括号。
 */
enum TokenEnum {
  // 表示数字类型的 token
  Number = "NUMBER",
  // 表示字符串类型的 token
  String = "STRING",
  // 表示调用表达式类型的 token
  CallExpression = "CALL_EXPRESSION",
  // 表示名称类型的 token，通常用于函数或变量名
  Name = "NAME",
  // 表示括号类型的 token，包括左括号和右括号
  Paren = "PAREN",
}

/**
 * 表示编译器中的一个 token。
 *
 * @typedef {Object} Token
 * @property {TokenEnum} type - token 的类型，来自 TokenEnum 枚举。
 * @property {string} value - token 的值，例如数字、字符串或标识符。
 */
type Token = {
  // token 的类型，来自 TokenEnum 枚举
  type: TokenEnum;
  // token 的值，例如数字、字符串或标识符
  value: string;
};

// 定义 ASTNode 类型
type ASTNode =
  | CallExpressionNode
  | StringLiteralNode
  | NumberLiteralNode
  | ProgramNode;

type ProgramNode = {
  type: ASTNodeType.Program;
  body: ASTNode[];
};

// 定义 CallExpressionNode 类型
type CallExpressionNode = {
  type: ASTNodeType.CallExpression;
  NAME: string;
  params: Array<ASTNode>;
};

// 定义 StringLiteralNode 类型
type StringLiteralNode = {
  type: ASTNodeType.StringLiteral;
  value: string;
};

// 定义 NumberLiteralNode 类型
type NumberLiteralNode = {
  type: ASTNodeType.NumberLiteral;
  value: string;
};

// 定义 ASTNodeType 枚举
enum ASTNodeType {
  Program = "Program",
  CallExpression = "CallExpression",
  StringLiteral = "StringLiteral",
  NumberLiteral = "NumberLiteral",
}

type NEW_ProgramNode = {
  type: ASTNodeType.Program;
  body: NEW_ASTNODE[];
};
type NEW_CallExpressionNode = {
  type: ASTNodeType.CallExpression;
  callee: {
    type: string;
    NAME: string;
  };
  arguments: NEW_ASTNODE[];
};
type NEW_ExpressionStatementNode = {
  type: NEWASTNodeType.ExpressionStatement;
  expression: NEW_CallExpressionNode;
};
type NEW_ASTNODE =
  | StringLiteralNode
  | NumberLiteralNode
  | NEW_ProgramNode
  | NEW_ExpressionStatementNode
  | NEW_CallExpressionNode;
// 定义 ASTNodeType 枚举
enum NEWASTNodeType {
  ExpressionStatement = "ExpressionStatement",
}

/**
 * 词法分析器，将输入字符串转换为 token 数组。
 *
 * @param {string} input - 需要分析的输入字符串。
 * @returns {Token[]} 包含分析得到的 token 的数组。
 */
const tokenizer = (input: string) => {
  // 当前字符的索引
  let current = 0;
  // 存储解析出的 token 的数组
  const tokens: Array<Token> = [];

  // 遍历输入字符串
  while (current < input.length) {
    // 获取当前字符
    const char = input[current];

    // 处理左括号
    if (char === "(") {
      // 添加左括号 token
      tokens.push({
        type: TokenEnum.Paren,
        value: "(",
      });
      // 移动到下一个字符
      current++;
      // 跳过当前循环，继续下一次循环
      continue;
    }

    // 处理右括号
    if (char === ")") {
      // 添加右括号 token
      tokens.push({
        type: TokenEnum.Paren,
        value: ")",
      });
      // 移动到下一个字符
      current++;
      // 跳过当前循环，继续下一次循环
      continue;
    }

    // 处理空格
    if (/\s/.test(char)) {
      // 移动到下一个字符
      current++;
      // 跳过当前循环，继续下一次循环
      continue;
    }

    // 处理名称（标识符）
    const LETTERS_REG = /[a-z]/;
    if (LETTERS_REG.test(char)) {
      // 存储名称的字符串
      let value = "";
      // 遍历名称中的字符
      while (LETTERS_REG.test(input[current])) {
        // 将字符添加到名称字符串中
        value += input[current];
        // 移动到下一个字符
        current++;
      }
      // 添加名称 token
      tokens.push({
        type: TokenEnum.Name,
        value,
      });
      // 跳过当前循环，继续下一次循环
      continue;
    }

    // 处理数字
    const NUMBER_REG = /[0-9]/;
    if (NUMBER_REG.test(char)) {
      // 存储数字的字符串
      let value = "";
      // 遍历数字中的字符
      while (NUMBER_REG.test(input[current])) {
        // 将字符添加到数字字符串中
        value += input[current];
        // 移动到下一个字符
        current++;
      }
      // 添加数字 token
      tokens.push({
        type: TokenEnum.Number,
        value,
      });
      // 跳过当前循环，继续下一次循环
      continue;
    }

    // 处理字符串
    if (char === '"') {
      // 存储字符串的字符串
      let value = "";
      // 移动到下一个字符（跳过起始引号）
      current++;
      // 遍历字符串中的字符
      while (input[current] !== '"') {
        // 将字符添加到字符串字符串中
        value += input[current];
        // 移动到下一个字符
        current++;
      }
      // 移动到下一个字符（跳过结束引号）
      current++;

      // 添加字符串 token
      tokens.push({
        type: TokenEnum.String,
        value,
      });
      // 跳过当前循环，继续下一次循环
      continue;
    }
  }

  // 返回解析得到的 token 数组
  return tokens;
};

/**
 * 解析器，将 token 数组转换为抽象语法树（AST）。
 *
 * @param {Token[]} tokens - 需要解析的 token 数组。
 * @returns {Object} 解析得到的抽象语法树（AST）。
 */
const parser = (
  tokens: Token[]
): { type: ASTNodeType; body: Array<ASTNode> } => {
  // 创建一个根节点，类型为 Program
  const ast: { type: ASTNodeType; body: Array<ASTNode> } = {
    type: ASTNodeType.Program,
    body: [],
  };
  // 当前 token 的索引
  let current = 0;

  /**
   * 递归遍历 tokens 数组，构建抽象语法树（AST）。
   *
   * @returns {ASTNode} 构建的抽象语法树（AST）节点。
   */
  const walk = (): ASTNode => {
    // 获取当前 token
    let token = tokens[current];
    // 解构赋值，获取 token 的类型和值
    const { type, value } = token;

    // 如果当前 token 是左括号
    if (type === TokenEnum.Paren) {
      if (value === "(") {
        // 移动到下一个 token
        token = tokens[++current];
        // 创建一个 CallExpression 节点
        let node: CallExpressionNode = {
          type: ASTNodeType.CallExpression,
          NAME: token.value,
          params: [],
        };
        // 移动到下一个 token
        token = tokens[++current];

        // 循环遍历，直到遇到右括号
        while (
          token.type !== TokenEnum.Paren ||
          (token.type === TokenEnum.Paren && token.value !== ")")
        ) {
          // 递归调用 walk 函数，构建参数节点
          node.params.push(walk());
          // 重置 token
          token = tokens[current];
        }
        // 遇到右括号后，跳出循环，移动到下一个 token
        current++;
        // 返回构建的 CallExpression 节点
        return node;
      }
    }

    // 如果当前 token 是字符串
    if (type === TokenEnum.String) {
      // 移动到下一个 token
      current++;
      // 返回一个 StringLiteral 节点
      return {
        type: ASTNodeType.StringLiteral,
        value: value,
      };
    }

    // 如果当前 token 是数字
    if (type === TokenEnum.Number) {
      // 移动到下一个 token
      current++;
      // 返回一个 NumberLiteral 节点
      return {
        type: ASTNodeType.NumberLiteral,
        value: value,
      };
    }

    // 如果当前 token 是其他类型，抛出错误
    throw new TypeError(String(token.type + token.value));
  };

  // 循环遍历 tokens 数组，构建抽象语法树（AST）
  while (tokens[current]) {
    ast.body.push(walk());
  }

  // 返回构建的抽象语法树（AST）
  return ast;
};

/**
 * 遍历抽象语法树（AST）的函数。
 *
 * @param {ASTNode} ast - 需要遍历的抽象语法树（AST）。
 * @param {Visitor} visitor - 访问者对象，包含对不同节点类型的处理方法。
 * @returns {void}
 */
const traverser = (ast: ASTNode, visitor): void => {
  /**
   * 遍历数组中的每个节点，并递归调用 traverseNode 函数。
   *
   * @param {Array<ASTNode>} arr - 需要遍历的节点数组。
   * @param {ASTNode | null} parent - 当前节点的父节点。
   * @returns {void}
   */
  const traverseArray = (arr: Array<ASTNode>, parent: ASTNode | null): void => {
    for (const node of arr) {
      if (node) traverseNode(node, parent);
    }
  };

  /**
   * 遍历单个节点，并根据节点类型调用相应的访问者方法。
   *
   * @param {ASTNode} node - 需要遍历的节点。
   * @param {ASTNode | null} parent - 当前节点的父节点。
   * @returns {void}
   */
  const traverseNode = (node: ASTNode, parent: ASTNode | null): void => {
    if (
      node.type !== ASTNodeType.Program &&
      node.type !== ASTNodeType.CallExpression &&
      node.type !== ASTNodeType.NumberLiteral &&
      node.type !== ASTNodeType.StringLiteral
    ) {
      throw new TypeError((node as any).type);
    }

    const method = visitor[node.type];
    method?.enter?.(node, parent);

    if (node.type === ASTNodeType.Program) {
      traverseArray(node.body, node);
      return;
    }

    if (node.type === ASTNodeType.CallExpression) {
      traverseArray(node.params, node);
      return;
    }

    method?.exit?.(node, parent);
  };

  traverseNode(ast, null);
};

const transformer = (ast) => {
  const newAst: NEW_ProgramNode = {
    type: ASTNodeType.Program,
    body: [],
  };
  ast._content = newAst.body;
  traverser(ast, {
    CallExpression: {
      enter(node, parent) {
        let args = [];

        if (parent.type === "Program") {
          parent._content.push({
            type: "ExpressionStatement",
            expression: {
              type: "CallExpression",
              callee: {
                type: "Identifier",
                NAME: node.NAME,
              },
              arguments: args,
            },
          });
        } else {
          parent._content.push({
            type: "CallExpression",
            callee: {
              type: "Identifier",
              NAME: node.NAME,
            },
            arguments: args,
          });
        }
        node._content = args;
      },
    },
    NumberLiteral: {
      enter(node, parent) {
        parent._content.push({
          ...node,
        });
      },
    },
    StringLiteral: {
      enter(node, parent) {
        parent._content.push({
          ...node,
        });
      },
    },
  });
  delete ast._content;
  return newAst;
};
const codeGenerator = (node) => {
  let code = "";
  if (node.type === "Program") {
    code = node.body.map(codeGenerator).join("/n");
  } else if (node.type === "ExpressionStatement") {
    code = `${codeGenerator(node.expression)};`;
  } else if (node.type === "CallExpression") {
    code = `${node.callee.NAME}(${node.arguments
      .map(codeGenerator)
      .join(", ")})`;
  } else if (node.type === "NumberLiteral") {
    code = node.value;
  } else if (node.type === "StringLiteral") {
    code = `"${node.value}"`;
  }
  return code;
};
const compiler = (input) => {
  // 进行词法分析，得到tokens数组(通过tokenizer)
  const tokens = tokenizer(input);
  // 进行语法分析，得到初版的ast(通过parser)
  const ast = parser(tokens);
  // 进行语法转换，得到处理后的新ast(通过transformer)
  const newAst = transformer(ast);
  // 使用新ast，进行代码生成(通过codegenerator)
  const code = codeGenerator(newAst);
  return code;
};

export { tokenizer, parser, transformer, codeGenerator, compiler };
