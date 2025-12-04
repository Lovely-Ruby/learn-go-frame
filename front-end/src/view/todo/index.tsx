import { useRequest } from 'alova/client'
import { Button, Card, Input, message, Modal, Space, Spin, Tag, Typography } from 'antd'
import { useState } from 'react'
import { alovaInstance } from '@/api/alova'

export function PageTodo() {
    const { Title } = Typography

    // =========================
    // 🔥 State
    // =========================
    const [modalOpen, setModalOpen] = useState(false)
    const [modalType, setModalType] = useState<'create' | 'edit'>('create')
    const [currentTodo, setCurrentTodo] = useState<Api.TodoItem | null>(null)
    const [titleInput, setTitleInput] = useState('')

    // =========================
    // 📌 获取列表（GET）
    // =========================
    const { data, loading, error, send: refreshList } = useRequest(
        () => alovaInstance.Get<Api.TodoListResponse>('/todo'),
    )
    const todoList = data?.data?.list || []

    // =========================
    // 📌 创建 Todo（POST）
    // =========================
    const { send: doCreate, loading: creating } = useRequest(
        () => alovaInstance.Post<Api.TodoCreateResponse>('/todo', { title: titleInput }),
        { immediate: false },
    )

    // =========================
    // 📌 更新 Todo（PUT）
    // =========================
    const { send: doUpdate, loading: updating } = useRequest(
        () =>
            alovaInstance.Put<Api.TodoUpdateResponse>(`/todo/${currentTodo?.id}`, {
                title: titleInput,
            }),
        { immediate: false },
    )

    // =========================
    // 📌 完成 Todo（PUT）
    // =========================
    const { send: doFinish } = useRequest(
        (id: number) => alovaInstance.Put<Api.TodoUpdateResponse>(`/todo/${id}`, { done: 1 }),
        { immediate: false },
    )

    // =========================
    // 📌 删除 Todo（DELETE）
    // =========================
    const { send: doDelete } = useRequest(
        (id: number) => alovaInstance.Delete<Api.TodoDeleteResponse>(`/todo/${id}`),
        { immediate: false },
    )

    // =========================
    // ✨ 处理事件
    // =========================
    const openCreateModal = () => {
        setModalType('create')
        setTitleInput('')
        setCurrentTodo(null)
        setModalOpen(true)
    }

    const openEditModal = (todo: Api.TodoItem) => {
        setModalType('edit')
        setTitleInput(todo.title)
        setCurrentTodo(todo)
        setModalOpen(true)
    }

    const handleFinish = async (id: number) => {
        await doFinish(id)
        message.success('已标记为完成')
        refreshList()
    }

    const handleDelete = (id: number) => {
        Modal.confirm({
            title: '确认删除？',
            content: '删除后不可恢复',
            okText: '删除',
            okType: 'danger',
            cancelText: '取消',
            onOk: async () => {
                await doDelete(id)
                message.success('删除成功')
                refreshList()
            },
        })
    }

    const handleModalOk = async () => {
        if (!titleInput.trim()) {
            message.warning('请输入标题')
            return
        }

        if (modalType === 'create') {
            await doCreate()
            message.success('新增成功')
        }
        else {
            await doUpdate()
            message.success('更新成功')
        }

        setModalOpen(false)
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
            <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
                <Title level={3} style={{ margin: 0 }}>📝 我的待办事项</Title>
                <Button type="primary" onClick={openCreateModal}>新增</Button>
            </Space>

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
                                            extra={(
                                                <Space>
                                                    {item.done === 0 && (
                                                        <Button type="link" onClick={() => handleFinish(item.id)}>
                                                            完成
                                                        </Button>
                                                    )}
                                                    <Button type="link" onClick={() => openEditModal(item)}>编辑</Button>
                                                    <Button danger type="link" onClick={() => handleDelete(item.id)}>
                                                        删除
                                                    </Button>
                                                </Space>
                                            )}
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
                                                    创建：
                                                    {item.createdAt}
                                                </span>
                                            </div>
                                        </Card>
                                    ))
                                )}
                        </div>
                    )}
            </Card>

            {/* =========================
                🪄 新增 / 编辑 Modal
            ========================= */}
            <Modal
                title={modalType === 'create' ? '新增 Todo' : '编辑 Todo'}
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                onOk={handleModalOk}
                confirmLoading={creating || updating}
            >
                <Input
                    placeholder="请输入待办内容"
                    value={titleInput}
                    onChange={e => setTitleInput(e.target.value)}
                />
            </Modal>
        </div>
    )
}
