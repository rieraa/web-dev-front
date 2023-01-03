import { Link, useNavigate, useLocation } from 'react-router-dom'
import MonacoEditor from "react-monaco-editor"
import { useEffect, useState } from 'react'
import { Card, Breadcrumb, Col, Row, Rate, Input, Button, message } from 'antd'
import './index.scss'
import { http } from '@/utils'
const { TextArea } = Input;

// 运行结果
const tabList = [
    {
        key: 'tab1',
        tab: '运行输出',
    },
    {
        key: 'tab2',
        tab: '详情',
    }
];


// 评星描述
const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

const TeacherReview = () => {
    const [activeTabKey1, setActiveTabKey1] = useState('tab1');
    const navigate = useNavigate()
    const [text, setText] = useState('')
    const [stars, setStars] = useState()
    const [review, setReview] = useState('')
    const [info, setInfo] = useState({})
    const onTab1Change = (key) => {
        setActiveTabKey1(key);
    };

    // 获取路径里的参数，班级号和题目号
    const location = useLocation()
    let msg = new URLSearchParams(location.search)
    const sid = msg.get('sid')
    const pid = msg.get('pid')

    const contentList = {
        tab1: <p style={{ height: '94px', overflow: 'auto' }}>
            {info.results}
        </p>,
        tab2: (
            <div>
                <p >开始时间：{info.startTime}</p>
                <p >提交时间：{info.endTime}</p>
                <p >运行时间：{info.runTime}</p>
            </div>
        ),
    };
    // 获取记录
    useEffect(() => {
        async function getDetail (pid, sid) {
            const res = await http.post('/teacher/records/review', {
                pid,
                sid
            })
            const { comment, content, score } = res.data
            setText(content)
            setStars(score)
            setReview(comment)
            setInfo(res.data)
        }
        getDetail(pid, sid)
    }, [pid, sid])

    const submitReview = async () => {
        const res = await http.post('/teacher/records/comment', {
            comment: review,
            score: stars,
            pid,
            sid
        })
        if (res.status === 0) {
            message.success("提交成功")
        } else message.error("提交失败" + res.message)
    }
    return (

        <Card style={{ height: '100%' }}
            title={
                <Breadcrumb separator=">">
                    <Breadcrumb.Item>
                        <Link to="/teacher/list">页首</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <span className='t_review-pre' onClick={() => {
                            navigate(-1)
                        }}>
                            {`${location.state.className} ${location.state.pbName}`}
                        </span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>{location.state.name}</Breadcrumb.Item>
                </Breadcrumb>}
        >
            <Row gutter={16}>
                <Col span={14}>
                    <div className='t_review-left'>
                        <MonacoEditor
                            height="100%"
                            width="100%"
                            language="python"
                            theme="vs-dark"
                            value={text}
                            options={{
                                selectOnLineNumbers: true,
                                matchBrackets: "near",
                            }}
                        />
                    </div>

                </Col>
                <Col span={10}>
                    <div className='t_review-right'>
                        <Card
                            style={{ width: '100%' }}
                            tabList={tabList}
                            activeTabKey={activeTabKey1}
                            onTabChange={key => {
                                onTab1Change(key);
                            }}
                        >
                            {contentList[activeTabKey1]}
                        </Card>
                        <div className='t_review-right-box'>
                            <Card title="评审"
                                style={{
                                    width: '100%',
                                }}>
                                <TextArea placeholder='老师评语' rows={5} value={review} onInput={(e) => {
                                    setReview(e.target.value)
                                }} />
                                <div className='t_review-right-box-bottom'>
                                    <span>
                                        <Rate tooltips={desc} onChange={setStars} value={stars} />
                                        {stars ? <span className="ant-rate-text">{desc[stars - 1]}</span> : ''}
                                    </span>
                                    <Button type="primary" onClick={submitReview}>确认</Button>
                                </div>
                            </Card>
                        </div>
                        <div className='t_review-right-pre_next'>
                            {/* <Button>下一个</Button> */}
                        </div>
                    </div>
                </Col>
            </Row>
        </Card>
    )
}

export default TeacherReview