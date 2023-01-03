import React, { useState, useEffect } from "react"
import { Link, useLocation } from 'react-router-dom'
import MonacoEditor from "react-monaco-editor"
import { Card, Breadcrumb, Button, message, Rate } from 'antd'
import { CaretRightFilled } from '@ant-design/icons'
import { http } from '@/utils'
import 'monaco-editor/esm/vs/basic-languages/python/python.contribution'
import './index.scss'


const StudentHomework = () => {
    const location = useLocation()
    const [record, setRecord] = useState(
        {
            content: '',
            comment: '暂无评价',
            pbContent: '..........',
            pbName: '....',
            score: 0
        }
    )
    const [activeTabKey, setActiveTabKey] = useState('result')
    const [result, setResult] = useState(``)

    const onTabChange = (key) => {
        setActiveTabKey(key)
    }
    function onChangeCodeHandle (value) {
        setRecord({ ...record, content: value })
    }

    const tabListNoTitle = [
        {
            key: 'result',
            tab: '运行结果',
        },
        {
            key: 'appraise',
            tab: '老师评语',
        },
    ]
    const contentListNoTitle = {
        result: <p style={{ fontSize: "22px" }}>{result}</p>,
        appraise: (
            <div>
                <p>分数：<Rate disabled value={record.score} /></p>
                <p>评语：{record.comment}</p>
            </div>
        ),
    }

    //  运行代码的逻辑
    const runCode = () => {
        async function fetchResult () {
            const res = await http.post('/student/runcode', { content: record.content })
            setResult(res.result)
        }
        fetchResult()
    }
    // 提交代码的逻辑
    async function codeSubmit () {
        let path = location.pathname.split('/')

        const res = await http.post('/student/submit', {
            pid: path[path.length - 1],
            content: record.content
        })
        if (res.status === 0) {
            message.success("提交成功")
        } else message.error("提交失败 " + res.message)


    }

    // 挂载时请求数据
    useEffect(() => {
        let path = location.pathname.split('/')
        async function getRecord () {
            const res = await http.post('/student/record', {
                pid: path[path.length - 1]
            })
            setRecord(res.data.results[0])
        }
        getRecord()
    }, [location.pathname])

    return (
        <div className="homework">
            <Card
                title={
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item>
                            <Link to="/student">首页</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>{record.pbName}</Breadcrumb.Item>
                    </Breadcrumb>}
            >
                <div className="homework-content">
                    <div className="homework-content-left">
                        <div className="homework-content-left-description">
                            <p>{record.pbContent}</p>
                        </div>
                        <div className="homework-content-left-appraise">
                            <Card
                                style={{
                                    width: '100%',
                                    height: '210px'
                                }}
                                tabList={tabListNoTitle}
                                activeTabKey={activeTabKey}
                                tabBarExtraContent={<a href="/more">More</a>}
                                onTabChange={(key) => {
                                    onTabChange(key)
                                }}
                            >
                                {contentListNoTitle[activeTabKey]}
                            </Card>

                        </div>
                    </div>
                    <div className="homework-content-right">
                        <MonacoEditor
                            height="100%"
                            width="100%"
                            language="python"
                            theme="vs-dark"
                            value={record.content}
                            onChange={onChangeCodeHandle}
                            options={{
                                selectOnLineNumbers: true,
                                matchBrackets: "near",
                            }}
                        />
                    </div>
                </div>
                <span className="homework-bottom">
                    <Button onClick={runCode} icon={<CaretRightFilled />} style={{ marginRight: '15px' }}>运行</Button>
                    {record.state === 3 ?
                        (<Button type="primary" disabled>已批改</Button>) :
                        (<Button type="primary" onClick={codeSubmit} >提交</Button>)
                    }
                </span>
            </Card>
        </div>
    )
}

export default StudentHomework