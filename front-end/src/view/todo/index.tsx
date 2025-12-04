import { useRequest } from 'alova/client'
import { Button, Card, List, message, Spin, Tag, Typography } from 'antd'
import { alovaInstance } from '@/api/alova'

export function PageTodo() {
    const { Title } = Typography

    // 🎯 GET /todo 自动推导为 Api.TodoListResponse
    const { data, loading, error, send: refreshList } = useRequest(
        () => alovaInstance.Get<Api.TodoListResponse>('/todo'),
    )

    const todoList = (data?.data?.list) || []

    // 🎯 PUT /todo/:id 自动推导为 Api.TodoUpdateResponse
    const { send: doFinish } = useRequest(
        (id: number) => alovaInstance.Put<Api.TodoUpdateResponse>(`/todo/${id}`, { done: 1 }),
        { immediate: false },
    )

    const handleFinish = async (id: number) => {
        await doFinish(id)
        message.success('已标记为完成')
        refreshList()
    }

    if (error) {
        return (
            <div style={{ padding: 30 }}>
                ❌ 加载失败：
                {error.message}
            </div>
        )
    }

    return (
        <div style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
            <Title level={3}>📝 我的待办事项</Title>
            <Card>
                {loading
                    ? (
                        <div style={{ padding: '40px 0', textAlign: 'center' }}>
                            <Spin />
                        </div>
                    )
                    : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {todoList.length === 0
                                ? (
                                    <div style={{ textAlign: 'center', color: '#999', padding: 20 }}>
                                        暂无待办事项
                                    </div>
                                )
                                : (
                                    todoList.map(item => (
                                        <Card
                                            key={item.id}
                                            size="small"
                                            style={{ borderRadius: 8 }}
                                            extra={
                                                item.done === 0 && (
                                                    <Button type="link" onClick={() => handleFinish(item.id)}>
                                                        完成
                                                    </Button>
                                                )
                                            }
                                        >
                                            <div style={{ fontSize: 16, fontWeight: 500 }}>
                                                <span
                                                    style={{
                                                        textDecoration: item.done ? 'line-through' : 'none',
                                                        color: item.done ? '#999' : '#333',
                                                    }}
                                                >
                                                    {item.title}
                                                </span>
                                            </div>

                                            <div style={{ marginTop: 4, fontSize: 12, color: '#999' }}>
                                                {item.done
                                                    ? (
                                                        <Tag color="green">已完成</Tag>
                                                    )
                                                    : (
                                                        <Tag color="blue">待办</Tag>
                                                    )}

                                                <span style={{ marginLeft: 8 }}>
                                                    创建时间：
                                                    {item.createdAt}
                                                </span>
                                            </div>
                                        </Card>
                                    ))
                                )}
                        </div>
                    )}
            </Card>

        </div>
    )
}
