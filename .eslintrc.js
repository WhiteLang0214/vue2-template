module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es6: true
  },
  extends: [
    'airbnb-base',
    'plugin:vue/essential',
    'eslint:recommended',
    'plugin:prettier/recommended'
  ],
  plugins: ['vue', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'generator-star-spacing': 'off',
    // 'import/no-named-as-default': 'off',
    // 'import/no-named-as-default-member': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    quotes: ['error', 'single'], //强制使用单引号
    semi: ['error', 'never'], //强制不使用分号结尾
    eqeqeq: ['error', 'always'], // 强制在任何情况下都使用 === 和 !==
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    "no-plusplus": [
      "off",
      {
        "allowForLoopAfterthoughts": true // allows unary operators ++ and -- in the afterthought (final expression) of a for loop
      }
    ],
    'brace-style': ['error', '1tbs', { allowSingleLine: true }], //强制在代码块中使用一致的大括号风格
    'no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'none',
        ignoreRestSiblings: true
      },
    ], // 没有使用的参数，报错
    "no-param-reassign": [ // 为这个规则添加一个白名单，即指定的入参名称不予限制
      "error",
      {
        "props": true,
        "ignorePropertyModificationsFor": [
          "e", // for e.returnvalue
          "ctx", // for Koa routing
          "req", // for Express requests
          "request", // for Express requests
          "res", // for Express responses
          "response", // for Express responses
          "state" // for vuex state
        ]
      }
    ]
  },
  parserOptions: {
    ecmaVersion: 6, // 词法解析器使用babel-eslint，以更好的适配es6的新api
    sourceType: 'module', // 启用 ES6 语法支持;默认设置为3，5（默认）， 你可以使用 6、7、8 或 9 来指定你想要使用的 ECMAScript 版本。你也可以用使用年份命名的版本号指定为 2015（同 6），2016（同 7），或 2017（同 8）或 2018（同 9）
    parser: 'babel-eslint' // 设置为 "script" (默认) 或 "module"（如果你的代码是 ECMAScript 模块)。
  }
}