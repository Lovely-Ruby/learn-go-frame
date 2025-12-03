import { useRequest } from 'alova/client'
import { Button } from 'antd'
import { alovaInstance } from '@/api/alova'

export function PageTodo() {
    const { data } = useRequest(
        alovaInstance.Get('/todo'),
    )
    console.log('data:>>', data)
    return (
        <>
            <div>
                这是 todo 的页面
            </div>
            <Button>点我123312</Button>
        </>
    )
}
