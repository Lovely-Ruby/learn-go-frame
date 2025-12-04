import { CheckOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { useRequest } from 'alova/client'
import {
    Button,
    Card,
    Empty,
    Input,
    message,
    Modal,
    Space,
    Spin,
    Tabs,
    Tag,
    Tooltip,
    Typography,
} from 'antd'
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
    const [tabKey, setTabKey] = useState<'all' | 'todo' | 'done'>('all')

    // =========================
    // 📌 获取列表（GET）
    // =========================
    const { data, loading, error, send: refreshList } = useRequest(
        () => alovaInstance.Get<Api.TodoListResponse>('/todo'),
        { force: true },
    )
    const todoList = data?.data?.list || []

    // 根据 Tabs 过滤
    const filteredList = todoList.filter((item) => {
        if (tabKey === 'todo')
            return item.done === 0
        if (tabKey === 'done')
            return item.done === 1
        return true
    })

    // =========================
    // 📌 创建 / 更新 / 删除 / 完成
    // =========================
    const { send: doCreate, loading: creating }
        = useRequest(() => alovaInstance.Post<Api.TodoCreateResponse>('/todo', { title: titleInput }), { immediate: false })

    const { send: doUpdate, loading: updating }
        = useRequest(() => alovaInstance.Put<Api.TodoUpdateResponse>(`/todo/${currentTodo?.id}`, { title: titleInput }), { immediate: false })

    const { send: doFinish }
        = useRequest((id: number) => alovaInstance.Put<Api.TodoUpdateResponse>(`/todo/${id}`, { done: 1 }), { immediate: false })

    const { send: doDelete }
        = useRequest((id: number) => alovaInstance.Delete<Api.TodoDeleteResponse>(`/todo/${id}`), { immediate: false })

    // =========================
    // ✨ 事件处理
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
        if (!titleInput.trim())
            return message.warning('请输入标题')

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

    // =========================
    // ✨ UI 渲染
    // =========================
    if (error) {
        return (
            <div style={{ padding: 30 }}>
                ❌ 加载失败：
                {error.message}
            </div>
        )
    }

    return (
        <div style={{ padding: 24, maxWidth: 650, margin: '0 auto' }}>
            {/* 头部 */}
            <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
                <Title level={3} style={{ margin: 0 }}>📝 待办中心</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
                    新增
                </Button>
            </Space>

            {/* Tabs */}
            <Tabs
                activeKey={tabKey}
                onChange={key => setTabKey(key as any)}
                items={[
                    { key: 'all', label: '全部' },
                    { key: 'todo', label: '待办' },
                    { key: 'done', label: '已完成' },
                ]}
            />

            <Card style={{ borderRadius: 12, overflow: 'hidden' }}>
                {loading
                    ? (
                        <div style={{ padding: '50px 0', textAlign: 'center' }}>
                            <Spin size="large" />
                        </div>
                    )
                    : filteredList.length === 0
                        ? (
                            <Empty
                                description="暂无数据"
                                style={{ padding: '40px 0' }}
                            />
                        )
                        : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {filteredList.map(item => (
                                    <Card
                                        key={item.id}
                                        size="small"
                                        style={{
                                            borderRadius: 10,
                                            background: item.done ? '#fafafa' : '#fff',
                                            transition: '0.25s',
                                        }}
                                        hoverable
                                        extra={(
                                            <Space size={4}>
                                                {item.done === 0 && (
                                                    <Tooltip title="标记完成">
                                                        <Button
                                                            icon={<CheckOutlined />}
                                                            type="text"
                                                            onClick={() => handleFinish(item.id)}
                                                        />
                                                    </Tooltip>
                                                )}

                                                <Tooltip title="编辑">
                                                    <Button
                                                        icon={<EditOutlined />}
                                                        type="text"
                                                        onClick={() => openEditModal(item)}
                                                    />
                                                </Tooltip>

                                                <Tooltip title="删除">
                                                    <Button
                                                        icon={<DeleteOutlined />}
                                                        danger
                                                        type="text"
                                                        onClick={() => handleDelete(item.id)}
                                                    />
                                                </Tooltip>
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
                                ))}
                            </div>
                        )}
            </Card>

            {/* =========================
                🪄 新增 / 编辑 Modal
            ========================= */}
            <Modal
                title={modalType === 'create' ? '新增待办事项' : '编辑待办事项'}
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                onOk={handleModalOk}
                confirmLoading={creating || updating}
            >
                <div style={{ marginBottom: 10, color: '#888' }}>
                    {modalType === 'create'
                        ? '请输入新的待办事项标题'
                        : '修改你的待办事项标题'}
                </div>
                <Input
                    placeholder="请输入待办内容，例如：明天买咖啡"
                    value={titleInput}
                    onChange={e => setTitleInput(e.target.value)}
                />
            </Modal>
        </div>
    )
}
