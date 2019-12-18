module.exports = {
    devServer: {
        proxy: {
            '/youtube': {
                target: 'http://localhost:3000',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    "^/youtube": ""
                },
                logLevel: "debug"
            }
        }
    }
}