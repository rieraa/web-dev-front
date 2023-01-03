import { useState } from 'react'
import { Card, Breadcrumb, Button, Table, Space, Tag } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { http } from '@/utils'
import './index.scss'


const TeacherDetailList = () => {

    // 加载
    const [loading, setLoading] = useState(false);

    //  列
    const columns = [
        {
            title: '学生编号',
            dataIndex: 'sid'
        }
        ,
        {
            title: '题目名称',
            dataIndex: 'pbName',
            width: 220
        },
        {
            title: '完成时间',
            dataIndex: 'endTime',
        },
        {
            title: '批改情况',
            dataIndex: 'state',
            render: data => {
                if (data === 1) {
                    return <Tag>未完成</Tag>
                } else if (data === 2) {
                    return <Tag color='blue'>未批改</Tag>
                }
                return <Tag color='green'>已批改</Tag>
            }
        },
        {
            title: '学生名',
            dataIndex: 'name',
        },
        {
            title: '操作',
            render: data => {
                return (
                    <Space size="middle">
                        <Button type="primary" shape="round" icon={<EyeOutlined />}
                            onClick={() => {
                                navigate(`/teacher/list/search/review?sid=${data.sid}&pid=${pid}`, {
                                    state: {
                                        className: location.state.className,
                                        pbName: location.state.pbName,
                                        name: data.name
                                    }
                                })
                            }}
                        >查看</Button>
                    </Space>
                )
            }
        }
    ]
    const navigate = useNavigate()


    // 表格数据存储
    const [list, setList] = useState([])

    // 表格参数管理
    const [tableParams, setTableParams] = useState({
        current: 1,
        pageSize: 5,
        showSizeChanger: true
    })

    const handleTableChange = (pagination) => {
        setTableParams(
            pagination
        )
    }

    // 获取路径里的参数，班级号和题目号
    const location = useLocation()
    let msg = new URLSearchParams(location.search)
    const cid = msg.get('class')
    const pid = msg.get('question')
    //获取班级题目完成情况
    useEffect(() => {

        async function fetchList (cid, pid, pageSize, currentPage) {
            setLoading(true);
            const res = await http.post('/teacher/records/classproblem', {
                cid,
                pid,
                pageSize,
                currentPage
            })
            setLoading(false);
            const { countAll, results } = res.data
            setList(results)
            setTableParams(tableParams => (
                { ...tableParams, total: countAll }
            ))
        }
        fetchList(cid, pid, tableParams.pageSize, tableParams.current)
    }, [JSON.stringify(tableParams), cid, pid])


    return <div className='main'>
        <Card style={{ height: '100%' }}
            title={
                <Breadcrumb separator=">">
                    <Breadcrumb.Item>
                        <Link to="/teacher/list">首页</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>{`${location.state.className} ${location.state.pbName}`}</Breadcrumb.Item>
                </Breadcrumb>}
        >
            <Table rowKey="id" columns={columns} dataSource={list}
                pagination={tableParams}
                onChange={handleTableChange}
                loading={loading}
            />
        </Card>

    </div>
}

export default TeacherDetailList 