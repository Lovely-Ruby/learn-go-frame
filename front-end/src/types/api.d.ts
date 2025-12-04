// src/types/api.d.ts
declare namespace Api {
    /** 单条 Todo 数据 */
    interface TodoItem {
        id: number
        title: string
        done: number // 0 未完成；1 已完成
        createdAt: string
        updatedAt: string
    }

    /** GET /todo 返回的数据结构 */
    interface TodoListResponse {
        code: number
        message: string
        data: {
            list: TodoItem[]
        }
    }

    /** PUT /todo/:id 返回结构（按你的后端可自定义） */
    interface TodoUpdateResponse {
        code: number
        message: string
    }
}
