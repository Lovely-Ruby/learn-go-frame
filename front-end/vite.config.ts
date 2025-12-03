import process from 'node:process'

import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
// https://vite.dev/config/
export default defineConfig((configEnv) => {
    const viteEnv = loadEnv(configEnv.mode, process.cwd())
    console.log('viteEnv:>>', viteEnv)
    return {
        plugins: [react()],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
                '~': fileURLToPath(new URL('./', import.meta.url)),
            },
        },
        server: {
            // open: true, // 是否主动唤醒浏览器
            // port: 9527, // 使用端口
            proxy: {
                '^/api/v1': {
                    target: viteEnv.VITE_API_URL,
                    changeOrigin: true,
                    // rewrite: path => path.replace(/^\/api\/v1/, ''), // 去掉前缀，默认的代理并没有被替代，改了后端
                },
            },
        },

    }
})
