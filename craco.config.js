//  添加自定义对于 webpack的配置
const path = require('path')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
module.exports = {
    // webpack 配置
    webpack: {
        // 配置别名
        alias: {
            // 约定：使用 @ 表示src文件所在路径
            '@': path.resolve(__dirname, 'src')
        },
        plugins: [
            new MonacoWebpackPlugin({
                // available options are documented at https://github.com/microsoft/monaco-editor/blob/main/webpack-plugin/README.md#options
                languages: ['json']
            })
        ]

    }
}