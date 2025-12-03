import { createAlova } from 'alova'
import adapterFetch from 'alova/fetch'
import ReactHook from 'alova/react'

export const alovaInstance = createAlova({
    baseURL: '/api/v1', // 这里会自动拼接到每个接口的前面的
    requestAdapter: adapterFetch(),
    responded: response => response.json(),
    statesHook: ReactHook, // 如果写 react 的话，要引入这个，不然白屏
})
