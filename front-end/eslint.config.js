import { antfu } from '@antfu/eslint-config'

// 第一个对象是基础配置（你没写东西）
// 第二个对象是覆盖 antfu 内置规则
export default antfu({

}, {
    rules: {
        'no-console': 'off', // 允许使用 console.log，不再警告
        'prefer-const': 'off', // 允许使用 let，不强制要求用 const
        'ts/ban-ts-comment': 'off', // 允许使用 @ts-ignore / @ts-nocheck 等注释
        'no-case-declarations': 'off', // 允许在 switch/case 里直接写 const/let
        'ts/no-use-before-define': 'off', // 允许变量或函数在定义前被使用
        'ts/no-unused-expressions': 'off', // 允许类似条件 && 表达式的写法
        'ts/no-empty-object-type': 'off', // 允许定义空对象类型 type A = {}
        'ts/no-unsafe-function-type': 'off', // 允许使用 any 函数签名 (...args: any[]) => any
        'ts/consistent-type-definitions': 'off', // 不强制只能用 type 或 interface，随便写
        'style/indent': ['error', 4], // 强制使用 4 空格缩进
        'style/jsx-indent-props': ['error', 4], // JSX 属性缩进也是 4 空格
        'prefer-promise-reject-errors': 'off', // 允许 reject('xxx')，不强制必须 new Error()
        'eslint-comments/no-unlimited-disable': 'off', // 允许写 /* eslint-disable */ 禁用所有规则
    },
})
