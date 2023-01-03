// import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import {
  Card,
  Button,
  Checkbox,
  Form,
  Input,
  Select,
  message,
  Radio
} from 'antd'
import { React, useState, useEffect } from 'react'
import { useStore } from '@/store'
import { useNavigate } from 'react-router-dom'
import { observer } from "mobx-react-lite"
import './index.scss'

const { Option } = Select

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 5,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 18,
    },
  },
}
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
}
// const getBase64 = (img, callback) => {
//   const reader = new FileReader()
//   reader.addEventListener('load', () => callback(reader.result))
//   reader.readAsDataURL(img)
// }

// const beforeUpload = (file) => {
//   const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
//   if (!isJpgOrPng) {
//     message.error('你只能上传格式为JPG或PNG的文件!')
//   }
//   const isLt2M = file.size / 1024 / 1024 < 2
//   if (!isLt2M) {
//     message.error('图片必须小于2MB!')
//   }
//   return isJpgOrPng && isLt2M
// }



const Register = () => {

  const [form] = Form.useForm()
  const { registerStore, classStore } = useStore()
  const [list, setList] = useState([])
  const navigate = useNavigate()
  useEffect(() => {
    async function getSelecters () {
      const res = await classStore.getClasslist()
      setList(res)
    }
    getSelecters()
  }, [classStore])


  const onFinish = async (values) => {
    console.log('Received values of form: ', values)
    let res = await registerStore.register(values)
    console.log('res', res)
    if (res.status === 0) {
      message.success('注册成功')
      navigate('/login', { replace: true })
    } else {
      let resmessage = res.message ? res.message : "服务器响应异常"
      message.error(`注册失败,${resmessage}`)
    }
  }

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 70,
        }}
      >
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    </Form.Item>
  )

  // const [loading, setLoading] = useState(false)
  // const [imageUrl, setImageUrl] = useState()
  // const handleChange = (info) => {
  //   if (info.file.status === 'uploading') {
  //     setLoading(true)
  //     return
  //   }
  //   if (info.file.status === 'done') {
  //     // Get this url from response in real world.
  //     getBase64(info.file.originFileObj, (url) => {
  //       setLoading(false)
  //       setImageUrl(url)
  //     })
  //   }
  // }

  // const uploadButton = (
  //   <div>
  //     {loading ? <LoadingOutlined /> : <PlusOutlined />}
  //     <div
  //       style={{
  //         marginTop: 8,
  //       }}
  //     >
  //       Upload
  //     </div>
  //   </div>
  // )


  return (

    <div className='register'>
      <Card className='register-container'>
        <Form
          {...formItemLayout}
          form={form}
          name="register"
          onFinish={onFinish}
          initialValues={{
            residence: ['zhejiang', 'hangzhou', 'xihu'],
            prefix: '86',
          }}
          scrollToFirstError
        >
          {/* <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="avatar"
                style={{
                  width: '100%',
                }}
              />
            ) : (
              uploadButton
            )}
          </Upload> */}

          <div className='Contains'>
            <Form.Item
              name="nickname"
              label="昵称"
              tooltip="给自己起一个合适的昵称吧！"
              rules={[
                {
                  message: '请输入您的昵称!',
                  whitespace: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="name"
              label="真实姓名"
              tooltip="请务必如实填写，否则将影响后续成绩！"
              rules={[
                {
                  required: true,
                  message: '请输入您的真实姓名!',
                  whitespace: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="gender"
              label="性别"
              rules={[
                {
                  required: true,
                  message: '请输入您的性别!'
                },
              ]}
            >
              <Radio.Group>
                <Radio value={'男'}>男</Radio>
                <Radio value={'女'}>女</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="password"
              label="密码"
              rules={[
                {
                  required: true,
                  pattern: /^[\S]{6,12}$/,
                  message: '密码6到12位!',
                },
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="confirm"
              label="确认密码"
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: '请再次输入您的密码!',
                },
                ({ getFieldValue }) => ({
                  validator (_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('两次输入的密码不一致，请重试!'))
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="account"
              label="电话"
              rules={[
                {
                  required: true,
                  pattern: /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/,
                  message: '手机号格式不正确',
                  validateTrigger: 'onBlur'
                },
              ]}
            >
              <Input
                addonBefore={prefixSelector}
                style={{
                  width: '100%',
                }}
              />
            </Form.Item>

            <Form.Item
              name="cid"
              label="班级"
              rules={[
                {
                  required: true,
                  message: '请选择您的班级!',
                },
              ]}
            >
              <Select
                showSearch
                placeholder="选择班级"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={list}
              />
            </Form.Item>

            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value ? Promise.resolve() : Promise.reject(new Error('需要同意用户协议和隐私条款！')),
                },
              ]}
              {...tailFormItemLayout}
            >
              <Checkbox>
                我已经阅读并同意<Button size='small' type='link'>用户协议和隐私条款</Button>
              </Checkbox>
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">
                注册
              </Button>
            </Form.Item></div>
        </Form>

      </Card>

    </div>
  )
}


export default observer(Register) 