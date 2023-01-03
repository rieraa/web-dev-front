import React from 'react'
import LoginStore from "./login.Store"
import UserStore from './user.Store'
import RegisterStore from './register.Store'
import ClassStore from './class.Store'
import ClassStudentsStore from './classStudents.Store'
class RootStore {
    constructor() {
        this.loginStore = new LoginStore()
        this.userStore = new UserStore()
        this.registerStore = new RegisterStore()
        this.classStore = new ClassStore()
        this.classStudentsStore = new ClassStudentsStore()
    }
}

// 实例化根
// 导出useStore context

const rootStore = new RootStore()
const context = React.createContext(rootStore)

const useStore = () => React.useContext(context)

export { useStore }