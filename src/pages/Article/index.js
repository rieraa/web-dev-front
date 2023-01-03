import { useState } from 'react'
import { Card, Breadcrumb, Form, Radio, Select, DatePicker, Button, Table, Tag, Space } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import img404 from '@/assets/error.png'
import { useEffect } from 'react'
import { http } from '@/utils'
const Article = () => {
    const { Option } = Select
    const { RangePicker } = DatePicker
    const onFinish = (values) => {
        const { status, channel_id, date } = values
        // 格式化表单数据
        const _params = {}
        // 格式化status
        _params.status = status
        if (channel_id) {
            _params.channel_id = channel_id
        }
        if (date) {
            _params.begin_pubdate = date[0].format('YYYY-MM-DD')
            _params.end_pubdate = date[1].format('YYYY-MM-DD')
        }
        // 修改params参数 触发接口再次发起
        setParams({
            ...params,
            ..._params
        })
    }

    const columns = [
        {
            title: '封面',
            dataIndex: 'cover',
            width: 120,
            render: cover => {
                return <img src={cover.images[0] || img404} width={80} height={60} alt="" />
            }
        },
        {
            title: '标题',
            dataIndex: 'title',
            width: 220
        },
        {
            title: '状态',
            dataIndex: 'status',
            render: data => <Tag color="green">审核通过</Tag>
        },
        {
            title: '发布时间',
            dataIndex: 'pubdate'
        },
        {
            title: '阅读数',
            dataIndex: 'read_count'
        },
        {
            title: '评论数',
            dataIndex: 'comment_count'
        },
        {
            title: '点赞数',
            dataIndex: 'like_count'
        },
        {
            title: '操作',
            render: data => {
                return (
                    <Space size="middle">
                        <Button type="primary" shape="circle" icon={<EditOutlined />} />
                        <Button
                            type="primary"
                            danger
                            shape="circle"
                            icon={<DeleteOutlined />}
                        />
                    </Space>
                )
            }
        }
    ]


    const [channels, setChannels] = useState([])
    const [article, setArticleList] = useState({
        list: [],
        count: 0
    })

    // 参数管理
    const [params, setParams] = useState({
        page: 1,
        per_page: 10
    })
    useEffect(() => {
        async function fetchChannels () {
            const res = await http.get('/channels')
            setChannels(res.data.channels)
        }
        fetchChannels()
    }, [])

    useEffect(() => {
        async function fetchArticleList () {
            const res = await http.get('/mp/articles', { params })
            const { results, total_count } = res.data
            setArticleList({
                list: results,
                count: total_count
            })
        }
        fetchArticleList()
    }, [params])
    return <div>
        <Card
            title={
                <Breadcrumb separator=">">
                    <Breadcrumb.Item>
                        <Link to="/">首页</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>内容管理</Breadcrumb.Item>
                </Breadcrumb>}
        >
            <Form initialValues={{ status: 0 }}
                onFinish={onFinish}
            >
                <Form.Item label="状态" name="status">
                    <Radio.Group>
                        <Radio value={0}>全部</Radio>
                        <Radio value={1}>草稿</Radio>
                        <Radio value={2}>待审核</Radio>
                        <Radio value={3}>审核通过</Radio>
                        <Radio value={4}>审核失败</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="频道" name="channel_id">

                    <Select
                        showSearch
                        placeholder="请选择文章频道"
                        optionFilterProp="children"
                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                        style={{ maxWidth: '400px' }}
                    >
                        {channels.map(item => (
                            <Option key={item.id} value={item.id}>{item.name}</Option>
                        ))}

                    </Select>

                </Form.Item>
                <Form.Item label="日期" name="date">
                    <RangePicker showTime />
                </Form.Item>
                <Form.Item >
                    <Button type="primary" htmlType="submit" >
                        筛选
                    </Button>
                </Form.Item>
            </Form>
        </Card>
        <Card title={`根据筛选条件共查询到 ${article.count} 条结果：`}>
            <Table rowKey="id" columns={columns} dataSource={article.list} />
        </Card>
    </div>
}

export default Article