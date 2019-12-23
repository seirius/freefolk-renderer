module.exports = {
    chainWebpack: config => {
        config.module
            .rule('vue')
            .use('vue-loader')
            .loader('vue-loader')
            .tap(options => {
                options.hotReload = false
                return options
            })
    },
    devServer: {
        proxy: {
            "/youtube": {
                target: "http://localhost:3000",
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    "^/youtube": ""
                },
                logLevel: "debug"
            },
            "/filemanager": {
                target: "http://localhost:3001",
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    "^/filemanager": ""
                },
                logLevel: "debug"
            },
            "/download": {
                target: "http://localhost:3004",
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    "^/download": ""
                },
                logLevel: "debug"
            },
            "/websocket": {
                target: "http://localhost:5000",
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    "^/websocket": "socket.io"
                },
                logLevel: "debug"
            },
        }
    }
}