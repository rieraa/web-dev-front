import { useState } from 'react'
import { Card, Breadcrumb, Radio, Button, Table, Tag, Space, Select } from 'antd'
import { EyeOutlined, CheckCircleOutlined, ExclamationCircleOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { http } from '@/utils'

const { Option } = Select
const StudentHome = () => {
    // 加载
    const [loading, setLoading] = useState(false);
    //  列
    const columns = [
        {
            title: '题目',
            dataIndex: 'pbName',
            width: 220
        },
        {
            title: '状态',
            dataIndex: 'state',
            render: data => {

                let item = <Tag icon={<CheckCircleOutlined />} color="warning">
                    未完成
                </Tag>
                if (data === 1) {
                    item = <Tag icon={<ExclamationCircleOutlined />} color="warning">
                        未完成
                    </Tag>
                }
                else if (data === 2) {
                    item = <Tag icon={<ClockCircleOutlined />} color="default">
                        未批改
                    </Tag>
                }
                else if (data === 3) {
                    item = <Tag icon={<ClockCircleOutlined />} color="success">
                        已批改
                    </Tag>
                }
                return (
                    item
                )

            }
        },
        {
            title: '发布时间',
            dataIndex: 'deliveryTime'
        },
        {
            title: '截止时间',
            dataIndex: 'endTime'
        },
        {
            title: '必做',
            dataIndex: 'mustdo',
            render: data => {
                if (data === 1) {
                    return <Tag color='blue'>必做</Tag>
                } else return <Tag>选做</Tag>
            }
        },
        {
            title: '操作',
            render: data => {
                if (data.endTime > data.deliveryTime) {
                    return (
                        <Button type="primary" shape="round" icon={<EyeOutlined />}
                            onClick={() => {
                                console.log("date:", data.endTime > data.deliveryTime)
                                navigate(`/publish/${data.pid}`)
                            }}
                        >查看</Button>
                    )
                } else return <Button type='primary' disabled>已截止</Button>
            }
        }
    ]
    const navigate = useNavigate()
    // 筛选信息
    const [code_state, setcodeState] = useState({
        state: 0,
        mustdo: 0,
    })

    const oncodeStateChange = (e) => {
        setcodeState({ ...code_state, state: e.target.value })
    }
    const oncodeMustChange = (value) => {
        setcodeState({ ...code_state, mustdo: value })
    }
    // 列表数据
    const [codelist, setCodeList] = useState({
        list: [],
        countAll: 0
    })
    // 页数参数管理
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
            showSizeChanger: true
        },
    })

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        })
    }

    // 获取题库
    useEffect(() => {
        async function fetchCodeList () {
            setLoading(true);
            const res = await http.post('/student/codelist', {
                currentPage: `${tableParams.pagination.current}`,
                pageSize: `${tableParams.pagination.pageSize}`,
                state: `${code_state.state}`,
                mustdo: `${code_state.mustdo}`
            })
            const { countAll, results } = res.data
            console.log(res.data)
            setLoading(false);
            setCodeList({
                list: results,
                count: countAll
            })
            // 由于是引用类型是浅比较，所以先将引用类型转换成json，再比较数据
            // 一共会执行两次副作用，第一次执行的时候由于更新了依赖项里面的total，从无total到有total了，导致了第二次执行
            // 第二次执行完相对于JSON的依赖项来说并没有发生改变，故到此结束
            setTableParams({
                ...tableParams,
                pagination: {
                    ...tableParams.pagination,
                    total: countAll
                }
            })
        }
        fetchCodeList()
    }, [JSON.stringify(tableParams), code_state])

    return (
        <div>
            <Card
                title={
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item>
                            <Link to="/student">首页</Link>
                        </Breadcrumb.Item>
                    </Breadcrumb>}
            >
                <span>筛选：</span>
                <Radio.Group onChange={oncodeStateChange} value={code_state.state}>
                    <Radio value={0}>全部</Radio>
                    <Radio value={1}>未完成</Radio>
                    <Radio value={2}>待批改</Radio>
                    <Radio value={3}>已批改</Radio>
                </Radio.Group>
                <span style={{ marginLeft: "35px" }}>必/选做：</span>
                <Select
                    style={{
                        width: 120
                    }}
                    value={code_state.mustdo}
                    onChange={oncodeMustChange}
                >
                    <Option value={0}>全部</Option>
                    <Option value={1}>必做</Option>
                    <Option value={2}>选做</Option>
                </Select>
            </Card>
            <Card title={`根据筛选条件共查询到 ${codelist.count} 条结果：`}>
                <Table rowKey="deliveryTime" columns={columns} dataSource={codelist.list}
                    pagination={tableParams.pagination}
                    onChange={handleTableChange}
                    loading={loading}
                />
            </Card>
        </div>
    )
}

export default StudentHome 