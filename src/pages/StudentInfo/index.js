import { InboxOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons'
import { React } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/store'
import './index.scss'

import {
    Button,
    Form,
    Radio,
    Select,
    Upload,
    Input,
    Avatar,
    Card,
    message
} from 'antd'
const { Option } = Select
const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 5,
    },
}
// const { Option } = Select
const normFile = (e) => {
    console.log('Upload event:', e)
    if (Array.isArray(e)) {
        return e
    }
    return e?.fileList
}

const StudentInfo = () => {
    const { userStore } = useStore()

    // 提交表单成功后的回调事件
    const onFinish = async (values) => {
        console.log('Success:', values)
        try {
            await userStore.modifyStuInfo({
                gender: values.gender,
                nickname: values.nickname,
                name: values.name
            })
            message.success('修改成功')
            userStore.getUserInfo()


        } catch (e) {
            message.error('修改失败')

        }

    }
    let userInfo = userStore.userInfo


    return (
        <Card
            style={{ height: '100%' }}
        >
            <div
                style={{ height: '100%', width: '100%' }}
            >

                <div className='studentInfo-container'>
                    <p>账号信息</p>
                    <span className='studentInfo-container_head'>
                        <Upload name="logo" action="/upload.do" listType="picture">
                            <Avatar size="small" icon={<UserOutlined />} />
                        </Upload>
                    </span>

                </div>

                <Form
                    name="validate_other"
                    {...formItemLayout}
                    onFinish={onFinish}
                    initialValues={{
                        'input-number': 3,
                        'checkbox-group': ['A', 'B'],
                        rate: 3.5,
                        'nickname': userInfo.nickname,
                        'gender': userInfo.gender,
                        'name': userInfo.name,
                        'account': userInfo.account,
                        'cname': userInfo.cname


                    }}
                >

                    {/* 昵称 */}
                    <Form.Item
                        shouldUpdate='true'
                        name="nickname"
                        label="昵称"
                        rules={[
                            {

                                message: 'Please input your nickname!',
                                whitespace: true,
                            },
                        ]}
                        initialValues
                    >
                        <Input />
                    </Form.Item>


                    {/* 真实姓名 */}
                    <Form.Item name='name' label="真实姓名">

                        <Input disabled='true' />
                    </Form.Item>


                    {/* 手机号码 */}
                    <Form.Item
                        name='account'
                        label="手机号码"
                    >

                        <Input disabled='true' />
                    </Form.Item>

                    {/* 性别 */}
                    <Form.Item shouldUpdate='true' name="gender" label="性别" >
                        <Radio.Group >
                            <Radio value="男">男</Radio>
                            <Radio value="女">女</Radio>
                        </Radio.Group>
                    </Form.Item>

                    {/* 班级 */}
                    <Form.Item name='cname' label="班级">

                        <Input disabled='true' />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" style={{ marginLeft: "300px" }}>保存</Button>

                </Form>

            </div>


        </Card>

    )
}
export default observer(StudentInfo) 