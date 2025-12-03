import { antfu } from '@antfu/eslint-config'

export default antfu({

}, {
    rules: {
        'no-console': 'off',
        'prefer-const': 'off',
        'ts/ban-ts-comment': 'off',
        'no-case-declarations': 'off',
        'ts/no-use-before-define': 'off',
        'ts/no-unused-expressions': 'off',
        'ts/no-empty-object-type': 'off',
        'ts/no-unsafe-function-type': 'off',
        'ts/consistent-type-definitions': 'off',
        'style/indent': ['error', 4],
        'style/jsx-indent-props': ['error', 4],
        'prefer-promise-reject-errors': 'off',
        'eslint-comments/no-unlimited-disable': 'off',
    },
})
