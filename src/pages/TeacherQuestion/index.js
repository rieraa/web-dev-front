import { Table, Card, Space, Tag, Button, Popconfirm, Modal, Form, Input, Drawer, DatePicker, Radio, Select, Breadcrumb, Divider } from 'antd'
import { React, useEffect, useState } from 'react'
import { useStore } from '@/store'
import { http } from '@/utils'
import { Link } from 'react-router-dom'





import './index.scss'
import { AppstoreAddOutlined } from '@ant-design/icons'


const TeacherQuestion = () => {

  const { TextArea } = Input

  const [loading, setLoading] = useState(false);

  // 存储数据库中拉取的数据
  const [list, setList] = useState([])
  //班级列表
  const [classList, setClassList] = useState([])
  // 设置填写表单页面是否显示
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [newQuestion, setNewQuestion] = useState({
    pbName: "",
    pbContent: ""
  })

  //删除气泡框
  const [open, setOpen] = useState(false)
  const [openPublish, setOpenPublish] = useState(false)

  const [confirmLoadingDel, setConfirmLoadingDel] = useState(false)

  //班级列表
  const { registerStore, classStore } = useStore()

  //题目编号
  const [pid, setPid] = useState("")
  //题目名称
  const [pbName, setPbName] = useState("")

  const onClosePublish = () => {
    setOpenPublish(false)
  }



  const showDrawerPublish = (record) => {
    setPid(record.pid)
    setPbName(record.pbName)
    console.log(pbName)
    getSelecters()
    setOpenPublish(true)
  }

  const showPopconfirmDel = () => {
    setOpen(true)
  }

  // 删除题目
  const handleOkDel = async (record) => {
    const response = await http.post("/teacher/question/delete", {
      pid: record.pid,
    })

    console.log(response)
    console.log("after")
    console.log(list)
    fetchQuestionList()
    setConfirmLoadingDel(true)
    setOpen(false)
    setConfirmLoadingDel(false)

  }

  const handleCancelDel = () => {
    console.log('取消删除')
    setOpen(false)
  }


  const addNewQuestion = async () => {
    console.log(newQuestion)
    const response = await http.post("/teacher/question/add", {
      pbContent: newQuestion.pbContent,
      pbName: newQuestion.pbName,
    })
    console.log(response)
    console.log(JSON.stringify(response.data))
    fetchQuestionList()


  }

  // setNewQuestion({...newQuestion,pbName:"xx"})
  const showModalAdd = () => {
    setIsModalOpen(true)

  }

  const handleOk = async () => {
    setIsModalOpen(false)
    addNewQuestion()
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  async function fetchQuestionList () {
    setLoading(true);
    const response = await http.get("/teacher/question/list")
    for (var i = 0; i < response.data.length; i++) {

      if (response.data[i].cids === null) {
        response.data[i].cids = []
        continue
      }
      var str = response.data[i].cids
      var arr = str.split(",")

      response.data[i].cids = arr

    }
    setList(response.data)
    setLoading(false);

  }


  //获取班级列表
  async function getSelecters () {
    const res = await classStore.getClasslist()
    setClassList(res)
  }

  //提交表单后
  const onFinish = (values) => {
    console.log(values)
  }

  const onFinishPublic = async (values) => {
    console.log('Received values of form: ', values)
    console.log(values.endTime.format('YYYY-MM-DD'))
    onClosePublish()
    const response = await http.post("/teacher/question/publish", {
      pid: pid,
      cid: values.cid,
      mustdo: values.mustdo,
      endTime: values.endTime.format('YYYY-MM-DD')
    })
    console.log(response)
    console.log(JSON.stringify(response.data))
    fetchQuestionList()
    setPbName("")

  }

  // 获取表单
  const [form] = Form.useForm()

  // 清空表单
  const onReset = () => {
    form.resetFields()
  }




  // 发布题目样式
  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  }
  const tailLayout = {
    wrapperCol: {
      offset: 8,
      span: 16,
    },
  }

  // 表头 列名
  const columns = [

    {
      className: 'container-qustionId',
      align: 'center',
      title: '题目编号',
      dataIndex: 'pid',
      key: 'pid',


    },
    {
      className: 'container-pbName',
      align: 'center',
      title: '题目名称',
      dataIndex: 'pbName',
      key: 'pid',
    },
    {
      className: 'container-pbContent',
      align: 'center',
      title: '题目内容',
      dataIndex: 'pbContent',
      key: 'pid',

      ellipsis: 'true'
    },
    {
      className: 'container-class',
      align: 'center',
      title: '发布班级',
      dataIndex: "cids",
      key: 'pid',

      render: (_, { cids }) => (

        <>
          {cids.map((num) => {
            let color = num === 5 ? 'geekblue' : 'green'

            return (

              <Tag color={color} key={num}>
                {num.toUpperCase() + '班'}
              </Tag>
            )
          })}
        </>
      ),
    },
    {
      className: 'container-action',
      align: 'center',
      title: '操作',
      key: 'pid',
      render: (_, record) => (
        <Space size="middle">
          <Button type='text' size='small'>查看 {record.name}</Button>
          <Button type='link' size='small' onClick={() => showDrawerPublish(record)}>发布 {record.name}</Button>



          <Popconfirm
            title="确认删除？"

            onConfirm={() => handleOkDel(record)}
            okButtonProps={{
              loading: confirmLoadingDel,
            }}
            onCancel={handleCancelDel}
          >
            <Button
              block="true"
              type="text"
              onClick={showPopconfirmDel}
              danger
            >
              删除
            </Button>
          </Popconfirm>



        </Space >
      ),
    },
  ]




  // 获取题库 
  useEffect(() => {
    fetchQuestionList()
  }, [JSON.stringify(list)])


  return (

    <div className="class">
      <Modal title="新增题目❤️" visible={isModalOpen} onOk={handleOk} onCancel={handleCancel} forceRender={true} getContainer={false} zIndex={9999} >
        <Form
          onFinish={onFinish}
        >
          <Form.Item
            name="pbName"
          >
            <Input
              placeholder="题目名称"
              value={newQuestion.pbName}
              onChange={e => {
                setNewQuestion({ ...newQuestion, pbName: e.target.value })

              }}
            />
          </Form.Item>

          <Form.Item
            name="pbContent"
          >
            <TextArea
              showCount
              maxLength={800}
              style={{
                height: 300,
              }}
              value={newQuestion.pbContent}
              placeholder="题目内容"
              onChange={e => {
                setNewQuestion({ ...newQuestion, pbContent: e.target.value })

              }}
            />
          </Form.Item>



        </Form>
      </Modal>

      <div className="class-hd">
        <Card title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/teacher/class">首页</Link>
            </Breadcrumb.Item>
          </Breadcrumb>}>
          <Space size='large'>
            <Button icon={<AppstoreAddOutlined />} onClick={showModalAdd} >
              添加题目
            </Button>
          </Space>
        </Card>
      </div>

      <div className="class-bd">
        <Card>
          <div className='container'>
            {/* 添加题目按钮 */}

            <div className='container-table'>
              <Table
                loading={loading}
                rowKey={"pid"}
                columns={columns}
                dataSource={list}
                rowClassName='container-table-row'
                pagination={{

                  pageSize: 7
                }
                }
              />
            </div>

          </div>
          <Drawer
            title="题目发布"
            width={360}
            onClose={onClosePublish}
            visible={openPublish}
            bodyStyle={{
              paddingBottom: 80,
            }}

          >

            <Form {...layout} form={form} name="control-hooks"
              onFinish={onFinishPublic}>
              <Form.Item
                label="题目名称"
              >
                <Input
                  defaultValue={pbName}
                  disabled={true}
                ></Input>

                
              </Form.Item>

              <Form.Item
                name="cid"
                label="班级选择"
              >
                <Select
                  showSearch
                  placeholder="选择班级"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={classList}
                />
              </Form.Item>

              <Form.Item
                label="截止时间"
                name="endTime"
              >
                <DatePicker />
              </Form.Item>

              <Form.Item
                label="题目类型"
                name="mustdo"
              >
                <Radio.Group>
                  <Radio value="1"> 必做 </Radio>
                  <Radio value="0"> 选做 </Radio>
                </Radio.Group>
              </Form.Item>





              <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
                <Button htmlType="button" onClick={onReset}>
                  重置
                </Button>

              </Form.Item>
            </Form>
          </Drawer>
        </Card>
      </div>

    </div>




  )
}
export default TeacherQuestion
