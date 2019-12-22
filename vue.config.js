module.exports = {
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
            }
        }
    }
}