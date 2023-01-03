import {Routes, Route} from 'react-router-dom'
import LayoutPc from '@/pages/Layout'
import Login from '@/pages/Login'
import {AuthRoute, AuthTeacher, AuthStudent} from './components/Auth'
import TeacherHome from './pages/TeacherHome'
import Publish from './pages/StudentHomework'
import StudentHome from './pages/StudentHome'
import TeacherList from './pages/TeacherList'
import {HistoryRouter, history} from './utils/history'
// antd国际化 中文
import {ConfigProvider} from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import StudentInfo from './pages/StudentInfo'
import Rejister from './pages/Register'
import TeacherClass from './pages/TeacherClass'
import TeacherQuestion from './pages/TeacherQuestion'
import TeacherDetailList from './pages/TeacherDetailList'
import TeacherReview from './pages/TeacherReview'
import TeacherClassInfo from './pages/TeacherClassInfo'


function App() {
    return (
        //路由配置
        <HistoryRouter history={history}>
            <ConfigProvider locale={zhCN}>
                <div className="App">
                    <Routes>
                        {/* 创建路由 path 和对应组件的关系 */}
                        {/* 需要鉴权的路由 */}
                        <Route path='/' element={
                            <AuthRoute>
                                <LayoutPc/>
                            </AuthRoute>
                        }>
                            <Route index element={
                                <AuthStudent>
                                    <StudentHome/>
                                </AuthStudent>
                            }/>
                            <Route path="publish/:id" element={
                                <AuthStudent>
                                    <Publish/>
                                </AuthStudent>
                            }/>
                            <Route path="student" element={
                                <AuthStudent>
                                    <StudentHome/>
                                </AuthStudent>
                            }
                            />
                            <Route path="studentinfo" element={
                                <AuthStudent>
                                    <StudentInfo/>
                                </AuthStudent>
                            }/>
                            <Route path="teacher" element={
                                <AuthTeacher>
                                    <TeacherHome/>
                                </AuthTeacher>
                            }/>
                            <Route path="teacher/list" element={
                                <AuthTeacher>
                                    <TeacherList/>
                                </AuthTeacher>
                            }/>
                            <Route path="teacher/list/search" element={
                                <AuthTeacher>
                                    <TeacherDetailList/>
                                </AuthTeacher>
                            }></Route>
                            <Route path="teacher/list/search/review" element={
                                <AuthTeacher>
                                    <TeacherReview/>
                                </AuthTeacher>
                            }></Route>
                            <Route path='teacher/class' element={
                                <AuthTeacher>
                                    <TeacherClass></TeacherClass>
                                </AuthTeacher>
                            }>
                            </Route>
                            <Route path='teacher/question' element={
                                <AuthTeacher>
                                    <TeacherQuestion/>
                                </AuthTeacher>
                            }
                            ></Route>
                            <Route path="teacher/class/classinfo" element={
                                <AuthTeacher>
                                    <TeacherClassInfo/>
                                </AuthTeacher>
                            }/>
                        </Route>
                        <Route path="/register" element={<Rejister/>}/>
                        <Route path='/login' element={<Login/>}/>
                    </Routes>
                </div>
            </ConfigProvider>

        </HistoryRouter>

    )
}

export default App
