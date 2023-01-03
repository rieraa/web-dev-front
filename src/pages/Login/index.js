import { Card, Button, Checkbox, Form, Input, message } from 'antd'
import './index.scss'
import { useStore } from '@/store'
import { useNavigate } from 'react-router-dom'

function Login () {
    const { loginStore, userStore } = useStore()
    const navigate = useNavigate()
    const onFinish = async (values) => {
        const res = await loginStore.getToken({
            account: values.account,
            password: values.password
        })
        if (res.status === 0) {
            // 跳转首页
            await userStore.getUserInfo()
            localStorage.setItem("role", `${userStore.userInfo.role}`)
            if (userStore.userInfo.role === "1") {
                navigate('/teacher', { replace: true })
            } else navigate('/', { replace: true })
            message.success('登陆成功')
        } else {
            message.error("登录失败，" + res.message)
        }
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo)
    }
    return (
        <div className='login'>
            <Card className='login-container'>
                <Form
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    validateTrigger={['onBlur']}
                    initialValues={{
                        account: '18888888888',
                        password: 'wang123'
                    }}
                >
                    <Form.Item
                        label="手机号"
                        name="account"
                        rules={[{
                            pattern: /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/,
                            message: '手机号格式不正确',
                            validateTrigger: 'onBlur',
                            len: 11,
                            max: 11
                        },
                        {
                            required: true,
                            message: '手机号不能为空!',
                        },
                        ]}
                    >
                        <Input placeholder='请输入手机号' />
                    </Form.Item>

                    <Form.Item
                        label="密码"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: '密码不能为空!',
                            }
                        ]}
                    >
                        <Input.Password placeholder='请输入密码' />
                    </Form.Item>

                    <Form.Item >
                        <Checkbox className='login-checkbox-label'>我已阅读并同意 [用户协议] 和 [隐私条款] </Checkbox>
                    </Form.Item>

                    <Form.Item style={{ marginBottom: '15px' }}>
                        <Button type="primary" htmlType="submit" block>
                            登录
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button block style={{ background: 'rgb(255, 85, 142)', color: '#fff' }}
                            onClick={() => {
                                navigate('/register')
                            }}
                        >
                            注册
                        </Button>
                    </Form.Item>

                </Form>

            </Card>
        </div>
    )
}

export default Login