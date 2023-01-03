import { http } from "@/utils"
import { makeAutoObservable } from "mobx"
class RegisterStore {
    constructor() {
        makeAutoObservable(this)
    }
    register = async ({ nickname, name, password, account, cid, gender }) => {
        const res = await http.post('/api/register', {
            nickname, name, password, account, cid, gender
        })
        return res
    }
}

export default RegisterStore