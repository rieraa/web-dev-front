import { useState } from 'react'
import { Card, Breadcrumb, Radio, Button, Table, Space, Select, Tag, Popconfirm, message } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useStore } from '@/store'
import { observer } from "mobx-react-lite"
import './index.scss'
import { http } from '@/utils'

const TeacherList = () => {

    // 加载
    const [loading, setLoading] = useState(false);

    //  列
    const columns = [
        {
            title: '题目编号',
            dataIndex: 'pid',
        },
        {
            title: '题目',
            dataIndex: 'pbName',
            width: 220
        },
        {
            title: '发布时间',
            dataIndex: 'deliveryTime',
        },
        {
            title: '必做',
            dataIndex: 'mustdo',
            render: data => {
                if (data === '1') {
                    return <Tag color='blue'>必做</Tag>
                } else return <Tag>选做</Tag>
            }
        },
        {
            title: '完成数',
            render: data => {
                return (
                    <Space size="middle">
                        <p>{data.finishnum} / {data.allnum}</p>
                    </Space>
                )
            }
        },
        {
            title: '操作',
            render: data => {
                return (
                    <Space size="middle">
                        <Button type="primary" shape="round" icon={<EyeOutlined />}
                            onClick={() => {
                                navigate(`/teacher/list/search?class=${siftstate.class}&question=${data.pid}`, {
                                    state: {
                                        className: siftstate.className,
                                        pbName: data.pbName
                                    }
                                })
                            }}>查看</Button>

                        <Popconfirm
                            title="确定从该班取消发布这道题吗?"
                            onConfirm={async () => {
                                const res = await http.post('/teacher/question/deleteClassQuestion', {
                                    pid: data.pid,
                                    cid: siftstate.class
                                })
                                if (res.status === 0) {
                                    setLoading(true);
                                    const res = await http.post("/teacher/records/list", {
                                        cid: siftstate.class,
                                        mustdo: siftstate.isDemand,
                                        pageSize: tableParams.pageSize,
                                        currentPage: tableParams.current
                                    })
                                    const { countAll, results } = res.data
                                    setLoading(false);
                                    setCodeList({
                                        list: results,
                                        count: countAll
                                    })
                                    setTableParams(tableParams => (
                                        { ...tableParams, total: countAll }
                                    ))
                                    message.success("取消成功")
                                } else (
                                    message.error("取消失败，" + res.message)
                                )
                            }}
                            okText="是"
                            cancelText="否"
                        >
                            <Button shape='round' danger>取消发布</Button>
                        </Popconfirm>
                    </Space>
                )
            }
        }
    ]
    const navigate = useNavigate()
    const { classStore } = useStore()
    // 下拉菜单存储
    const [list, setList] = useState([])

    // 记录筛选的状态
    const [siftstate, setSiftState] = useState({
        class: 1,
        isDemand: '0',
        className: 'loading'
    })

    // 表格数据存储
    const [codelist, setCodeList] = useState({
        list: [],
        count: 0
    })

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

    // 初始化下拉框
    useEffect(() => {
        async function getSelecters () {
            const res = await classStore.getClasslist()
            setList(res)
            setSiftState(siftstate => ({ ...siftstate, class: res[0].value, className: res[0].label }))
        }
        getSelecters()
    }, [classStore])


    //获取做题表
    useEffect(() => {
        async function getRecords (cid, mustdo, pageSize, currentPage) {
            setLoading(true);
            const res = await http.post("/teacher/records/list", {
                cid,
                mustdo,
                pageSize,
                currentPage
            })
            const { countAll, results } = res.data
            setLoading(false);
            setCodeList({
                list: results,
                count: countAll
            })
            setTableParams(tableParams => (
                { ...tableParams, total: countAll }
            ))
        }
        getRecords(siftstate.class, siftstate.isDemand, tableParams.pageSize, tableParams.current)
    }, [JSON.stringify(tableParams), siftstate])


    return <div className='main'>
        <Card
            title={
                <Breadcrumb separator=">">
                    <Breadcrumb.Item>
                        <Link to="/teacher/list">首页</Link>
                    </Breadcrumb.Item>
                </Breadcrumb>}
        >

            <Select
                style={{
                    width: 120,
                    marginRight: '25px'
                }}
                value={siftstate.class}
                onChange={(value) => {
                    setSiftState({ ...siftstate, class: value })
                }}
                options={list}
            />
            <Radio.Group onChange={(e) => {
                setSiftState({ ...siftstate, isDemand: e.target.value })
            }} value={siftstate.isDemand}>
                <Radio value={'0'}>全部</Radio>
                <Radio value={'1'}>必做</Radio>
                <Radio value={'2'}>选做</Radio>
            </Radio.Group>
        </Card>
        <Card title={`根据筛选条件共查询到 ${codelist.count} 条结果：`}
            style={{ height: '100%' }}
        >
            <Table rowKey="pid" columns={columns} dataSource={codelist.list}
                pagination={tableParams}
                onChange={handleTableChange}
                loading={loading}
            />
        </Card>
    </div>
}

export default observer(TeacherList)    