// 登录模块
import { makeAutoObservable } from "mobx"
import { http, getToken, setToken, clearToken } from '@/utils'

class LoginStore {
    token = getToken() || ''
    // 响应式mobx固定写法
    constructor() {
        makeAutoObservable(this)
    }
    // 登录
    getToken = async ({ account, password }) => {
        const res = await http.post('/api/login', {
            account,
            password
        })
        console.log(res)
        this.token = res.token
        setToken(res.token)
        return res
    }

    // 退出登录
    loginOut = () => {
        this.token = ''
        localStorage.removeItem("role")
        clearToken()
    }
}
export default LoginStore