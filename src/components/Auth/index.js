// 1. 判断token是否存在
// 2. 如果存在 直接正常渲染
// 3. 如果不存在 重定向到登录路由

// 高阶组件:把一个组件当成另外一个组件的参数传入 然后通过一定的判断 返回新的组件
import { getToken } from '@/utils'
import { Navigate } from 'react-router-dom'

function AuthRoute ({ children }) {
    const isToken = getToken()
    if (isToken) {
        return <>{children}</>
    } else {
        return <Navigate to="/login" replace />
    }
}

// <AuthComponent> <Layout/> </AuthComponent>
// 登录：<><Layout/></>
// 非登录：<Navigate to="/login" replace />

function AuthTeacher ({ children }) {

    // 是老师的话取消拦截，否则去首页
    if (localStorage.getItem("role") === '1') {
        return <>{children}</>
    } else {
        return <Navigate to="/" replace />
    }
}
function AuthStudent ({ children }) {
    if (localStorage.getItem("role") === '2') {
        return <>{children}</>
    } else {
        return <Navigate to="/teacher" replace />
    }
}

export { AuthRoute, AuthTeacher, AuthStudent } 