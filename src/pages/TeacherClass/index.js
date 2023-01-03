import { Card, Button, Col, Row, message, Popconfirm, Breadcrumb, Input, Space, Modal } from "antd"
import { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom'
import { observer } from "mobx-react-lite"
import { useStore } from "@/store";
const { Search } = Input;


const TeacherClass = () => {
    const navigate = useNavigate()
    const { classStore } = useStore()
    const [search, setSearch] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cname, setCname] = useState('');
    // 获取对应元素的cid

    const onSearch = (value) => {
        setSearch(value);
    }
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = async () => {
        const res = await classStore.addClass(cname)
        if (res.status === 0) {
            message.success('新增成功')
            classStore.getClass('')
        } else message.error(`新增失败 ${res.message}`)
        setCname('')
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    useEffect(() => {
        async function getClass () {
            await classStore.getClass(search)
        }
        getClass()
    }, [classStore, search])
    return (
        <div className="class">
            <Modal title="新增班级❤️" visible={isModalOpen} onOk={handleOk} onCancel={handleCancel} forceRender={true} getContainer={false} zIndex={9999} >
                <Input onChange={(e) => {
                    setCname(e.target.value)
                }} size="small" value={cname} placeholder="请输入班级名称"></Input>
            </Modal>
            <div className="class-hd">
                <Card title={
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item>
                            <Link to="/teacher/class">首页</Link>
                        </Breadcrumb.Item>
                    </Breadcrumb>}>
                    <Space size='large'>
                        <Button onClick={showModal}>新增班级</Button>
                        <Search style={{ width: 400 }} placeholder="输入班级名字进行搜索" onSearch={onSearch} enterButton />
                    </Space>
                </Card>
            </div>
            <div className="class-bd">
                <Card>
                    <Row gutter={[16, 16]}>
                        {classStore.classes.map((item) => {
                            return (
                                <Col key={item.cid} span={6}>
                                    <Card title={`班级编号：${item.cid}`} type="inner" hoverable bordered={true}
                                        extra={
                                            <>
                                                <Popconfirm
                                                    title="确定删除此班级?"
                                                    onConfirm={async () => {
                                                        const res = await classStore.deleteClass(item.cid)
                                                        if (res.status === 0) {
                                                            message.success("删除成功")
                                                        } else message.error(`删除失败 ${res.message}`)
                                                        classStore.getClass('')
                                                    }}
                                                    okText="是"
                                                    cancelText="否"
                                                >
                                                    <Button size="small" type="link">删除</Button>
                                                </Popconfirm>
                                            </>
                                        }
                                    >
                                        <div>
                                            <p>{`班级名称：${item.cname}`}</p>
                                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                <p>{`班级人数：${item.count}`}</p>
                                                <Button size="small" type="primary" onClick={() => { navigate(`/teacher/class/classinfo?class=${item.cid}&cname=${item.cname}`) }}>查看详情</Button>
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            )
                        })}

                    </Row>
                </Card>

            </div>
        </div>
    )
}

export default observer(TeacherClass)