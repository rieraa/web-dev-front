import { useState } from 'react'
import { Card, Breadcrumb, Button, Table, Space, Input, Popconfirm, message, Modal, Select } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { observer } from "mobx-react-lite"
import { useStore } from "@/store";

import './index.scss'
import { http } from '@/utils'

const TeacherClassInfo = () => {

    //  列
    const columns = [
        {
            title: '学生编号',
            dataIndex: 'sid',
        },
        {
            title: '学生姓名',
            dataIndex: 'name',
            // width: 220
        },
        {
            title: '所属班级',
            dataIndex: 'cname',
        },

        {
            title: '操作',
            render: data => {
                return (
                    <Space size="middle">
                        <Button type="primary" onClick={() => { showModal_update(data.sid) }} shape="round">修改班级</Button>
                        <Popconfirm
                            title="确定从该班级删除此学生吗?"
                            onConfirm={async () => {
                                const res = await classStudentsStore.deleteStudent(data.sid)
                                if (res.status === 0) {
                                    message.success("删除成功")
                                    classStudentsStore.getClassStudents(cid, '')
                                    // 更新下拉列表
                                    const res = await classStudentsStore.getStudents_noClass()
                                    setList(res)
                                } else message.error("删除失败，" + res.message)
                            }}
                            okText="是"
                            cancelText="否"
                        >
                            <Button type="primary" shape='round' danger>删除</Button>
                        </Popconfirm>
                    </Space>
                )
            }
        }
    ]

    const { classStudentsStore, classStore } = useStore()
    const [search, setSearch] = useState('')
    const [isModalOpen_add, setIsModalOpen_add] = useState(false);
    const [isModalOpen_update, setIsModalOpen_update] = useState(false);
    // 存放下拉列表的list
    const [list, setList] = useState([])
    const [clist, setClist] = useState([])
    // 用于存储待添加学生的id 
    let newStuId = 0
    const [sid_update, setSid_update] = useState(0)
    // 存储学生修改成班级cid为
    let newCid = null
    // 获取路径里的参数，班级号和题目号
    const location = useLocation()
    let msg = new URLSearchParams(location.search)
    const cid = msg.get('class')
    const cname = msg.get('cname')

    // 与学生绑定的，搜索和获取没选课学生列表
    useEffect(() => {
        async function getClassDetail (cid, search) {
            await classStudentsStore.getClassStudents(cid, search)
            const res = await classStudentsStore.getStudents_noClass()
            setList(res)
        }
        getClassDetail(cid, search)
    }, [cid, search, classStudentsStore])

    // 获取班级的下拉框
    useEffect(() => {
        async function getClassList () {
            const res = await classStore.getClasslist()
            setClist(res)
        }
        getClassList()
    }, [classStore])

    const { Search } = Input;

    const onSearch = (value) => {
        setSearch(value);
    }

    const showModal_add = () => {
        setIsModalOpen_add(true);
    };
    const okModal_add = async () => {
        const res = await http.post('/teacher/classinfo/adds', {
            sid: newStuId,
            cid: cid
        })
        if (res.status === 0) {
            message.success("添加成功")
            newStuId = 0
            classStudentsStore.getClassStudents(cid, '')
            const res = await classStudentsStore.getStudents_noClass()
            setList(res)
            setIsModalOpen_add(false)
        } else {
            message.error("添加失败," + res.message)
        }
    }
    const cancelModal_add = () => {
        newStuId = 0
        setIsModalOpen_add(false)
    }

    const showModal_update = (sid) => {
        setSid_update(sid)
        setIsModalOpen_update(true);
    };
    const okModal_update = async () => {
        const res = await http.post('/teacher/classinfo/modifyclass', {
            sid: sid_update,
            cid: newCid
        })
        if (res.status === 0) {
            message.success("修改成功")
            classStudentsStore.getClassStudents(cid, '')
            setIsModalOpen_update(false)
        } else {
            message.error("修改失败," + res.message)
        }
    }
    const cancelModal_update = () => {
        newStuId = 0
        setIsModalOpen_update(false)
    }
    // 表格参数管理
    const [tableParams, setTableParams] = useState({
        current: 1,
        pageSize: 10,
    })

    const handleTableChange = (pagination) => {
        setTableParams(
            pagination
        )
    }

    return <div className='main'>
        <Modal title="新增学生❤️" visible={isModalOpen_add}
            onOk={okModal_add}
            onCancel={cancelModal_add}
            orceRender={true} getContainer={false}
        >
            <span>可添加的学生：</span>
            <Select
                showSearch
                placeholder="选择学生"
                optionFilterProp="children"
                filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={list}
                onChange={(value) => {
                    newStuId = value
                }}
            />
        </Modal>

        <Modal title="修改学生班级❤️" visible={isModalOpen_update}
            onOk={okModal_update}
            onCancel={cancelModal_update}
            orceRender={true} getContainer={false}
        >
            <span>修改班级为：</span>
            <Select
                showSearch
                placeholder="选择班级"
                optionFilterProp="children"
                filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={clist}
                onChange={(value) => {
                    newCid = value
                    console.log("id", newCid, newStuId)
                }}
            />
        </Modal>

        <Card
            title={
                <Breadcrumb separator=">">
                    <Breadcrumb.Item>
                        <Link to="/teacher/class">班级概览</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>{cname}</Breadcrumb.Item>
                </Breadcrumb>}
        >
            <Space size='large'>
                <Button shape="round" onClick={showModal_add}>新增学生</Button>
                <Search placeholder="请输入学生姓名" onSearch={onSearch} enterButton
                    style={{
                        width: 400,
                    }}
                />
            </Space>
        </Card>

        <Table rowKey="sid" columns={columns} dataSource={classStudentsStore.students}
            pagination={tableParams}
            onChange={handleTableChange}
        />

    </div>
}

export default observer(TeacherClassInfo)