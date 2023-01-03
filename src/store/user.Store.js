import { http } from "@/utils"
import { makeAutoObservable, runInAction } from 'mobx'

class UserStore {
    userInfo = {};
    constructor() {
        makeAutoObservable(this)
    }
    async getUserInfo () {
        const res = await http.get('/user/userinfo')
        if (res.status === 0) {
            runInAction(() => {
                this.userInfo = res.data
            })
        }
        return res
    }

    async modifyStuInfo ({ gender, nickname, name }) {
        console.log(123, gender)
        const res = await http.post('/student/editinfo', {
            gender,
            nickname,
            name
        })
        console.log(res)
    }

}

export default UserStore