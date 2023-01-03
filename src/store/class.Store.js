import { http } from "@/utils";
import { makeAutoObservable, runInAction } from "mobx";

class ClassStore {
    // 存放班级列表
    classes = []

    constructor() {
        makeAutoObservable(this)
    }
    // 获取下拉框里班级列表的，无需token
    async getClasslist () {
        let sel_list = []
        const res = await http.get("/api/records/class")
        if (res.status === 0) {
            runInAction(() => {
                this.classes = res.data
            })
            for (let i = 0; i < this.classes.length; i++) {
                sel_list.push({
                    value: this.classes[i].cid,
                    label: this.classes[i].cname
                })
            }
        }
        return sel_list
    }
    // 获取教师端班级列表的，需token
    async getClass (search) {
        const res = await http.post("/teacher/class/list", {
            search
        })
        if (res.status === 0) {
            runInAction(() => {
                this.classes = res.data
            })
        }
        return res
    }
    // 新增班级
    async addClass (cname) {
        const res = await http.post("/teacher/class/add", {
            cname
        })
        return res;
    }
    // 删除班级
    async deleteClass (cid) {
        const res = await http.post("/teacher/class/delete", {
            cid
        })
        return res
    }
    // 通过cid获取班级名
    getCnameById (cid) {
        for (let i = 0; i < this.classes.length; i++) {
            if (this.classes[i].cid === cid) {
                return this.classes[i].cname
            }
        }
        return null
    }

}

export default ClassStore