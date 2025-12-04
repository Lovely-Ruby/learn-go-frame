// alovaInstance.ts

import { createAlova } from 'alova'
import adapterFetch from 'alova/fetch'
import ReactHook from 'alova/react'
// 引入 antd 的 message 组件
import { message } from 'antd'

export const alovaInstance = createAlova({
    baseURL: '/api/v1',
    requestAdapter: adapterFetch(),
    statesHook: ReactHook,

    // 关键修正：将 responded 分为两步，处理 HTTP 错误和业务错误
    responded: {
        // 步骤 1：处理 HTTP 响应头和 body
        onSuccess: async (response) => {
            // 如果 HTTP 状态码不是 2xx，抛出错误，Alova 会捕获
            if (response.status >= 300) {
                message.error(`HTTP 错误: ${response.status} ${response.statusText}`)
                throw new Error(`HTTP 错误: ${response.status} ${response.statusText}`)
            }

            const json = await response.json() // 解析 JSON

            // 步骤 2：处理业务状态码 (Business Code)
            if (json.code !== 0) {
                message.error(json.message || '后端返回业务错误')
                // 如果后端返回的 code 不为 0，抛出错误，Alova 会将 useRequest 的 error 状态设为 true
                throw new Error(json.message || '后端返回业务错误')
            }

            // 业务状态码正确，返回完整的 JSON 对象
            return json
        },
        onError: (err) => {
            // 处理网络请求本身失败（如断网）的情况
            console.error('网络请求失败', err)
            message.error(err.message || '网络请求失败')
            throw new Error(err.message || '网络请求失败')
        },
    },
})
