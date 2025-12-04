import { CheckOutlined, DeleteOutlined, EditOutlined, RedoOutlined } from '@ant-design/icons'
import { Button, Card, Space, Tag, Tooltip } from 'antd'

interface Props {
    todo: Api.TodoItem
    onFinish: (id: number) => void
    onEdit: (todo: Api.TodoItem) => void
    onDelete: (id: number) => void
    onUnFinish: (id: number) => void
}

export function TodoCard({ todo, onFinish, onEdit, onDelete, onUnFinish }: Props) {
    return (
        <Card
            key={todo.id}
            size="small"
            style={{ borderRadius: 8 }}
            extra={(
                <Space>
                    {todo.done === 0 && (
                        <Tooltip title="标记为完成">
                            <Button
                                type="text"
                                icon={<CheckOutlined />}
                                onClick={() => onFinish(todo.id)}
                            />
                        </Tooltip>
                    )}
                    {todo.done === 1 && (
                        <Tooltip title="设为待办">
                            <Button
                                type="text"
                                icon={<RedoOutlined />}
                                onClick={() => onUnFinish(todo.id)}
                            />
                        </Tooltip>
                    )}
                    <Tooltip title="编辑">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => onEdit(todo)}
                        />
                    </Tooltip>
                    <Tooltip title="删除">
                        <Button
                            danger
                            type="text"
                            icon={<DeleteOutlined />}
                            onClick={() => onDelete(todo.id)}
                        />
                    </Tooltip>
                </Space>
            )}
        >
            <div style={{ fontSize: 16, fontWeight: 500 }}>
                <span
                    style={{
                        textDecoration: todo.done ? 'line-through' : 'none',
                        color: todo.done ? '#999' : '#333',
                    }}
                >
                    {todo.title}
                </span>
            </div>

            <div style={{ marginTop: 4, fontSize: 12, color: '#999' }}>
                {todo.done
                    ? <Tag color="green">已完成</Tag>
                    : <Tag color="blue">待办</Tag>}

                <span style={{ marginLeft: 8 }}>
                    创建：
                    {todo.createdAt}
                </span>
            </div>
        </Card>
    )
}
