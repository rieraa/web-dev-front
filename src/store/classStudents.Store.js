import { http } from "@/utils";
import { makeAutoObservable, runInAction } from "mobx";
class classStudents {
    students = []
    students_noclass = []
    constructor() {
        makeAutoObservable(this)
    }

    // 获取班级内的学生
    async getClassStudents (cid, search) {
        const res = await http.post("/teacher/classinfo/list", {
            cid,
            search
        })
        if (res.status === 0) {
            runInAction(() => {
                this.students = res.data
            })
        }
        return res
    }

    // 删除学生
    async deleteStudent (sid) {
        const res = await http.post('/teacher/classinfo/delete', {
            sid
        })
        return res
    }

    // 获取没有班级的学生并格式改为下拉框格式
    async getStudents_noClass () {
        let sel_list = []
        const res = await http.get('/teacher/classinfo/getstudents')
        if (res.status === 0) {
            runInAction(() => {
                this.students_noclass = res.data
            })
            for (let i = 0; i < this.students_noclass.length; i++) {
                sel_list.push({
                    value: this.students_noclass[i].sid,
                    label: this.students_noclass[i].name
                })
            }
        }
        return sel_list
    }

    // 新增学生
    async addStudent (sid, cid) {
        const res = await http.post('/teacher/classinfo/adds', {
            sid,
            cid
        })
        return res
    }
}

export default classStudents