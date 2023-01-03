import Bar from "@/components/Bar"
import Chart from "@/components/Chart"
import LineChart from "@/components/LineChart"
import { http } from "@/utils";
import { Card } from "antd";
import { useEffect, useState } from "react";


const Home = () => {

  const [chartData, setChartData] = useState([])
  const [barData, setBarData] = useState({
    xData: [],
    yData: []
  })
  const [lineData, setLineData] = useState({
    xData: [],
    yData: []
  })

  const chartDataChange = (chartData) => {
    let res = []
    for (let i = 0; i < chartData.length; i++) {
      let name = chartData[i].mustdo === 1 ? "必做" : "选做"
      res.push({
        name: name,
        value: chartData[i].count
      })
    }
    return res
  }

  const barDataChange = (barData) => {
    let res = {
      xData: [],
      yData: []
    }
    for (let i = 0; i < barData.length; i++) {
      res.xData.push(barData[i].cname)
      res.yData.push(barData[i].count)
    }
    return res
  }

  const lineDataChange = (lineData) => {
    let res = {
      xData: [],
      yData: []
    }
    for (let i = 0; i < lineData.length; i++) {
      res.xData.push(lineData[i].days)
      res.yData.push(lineData[i].count)
    }
    return res
  }


  useEffect(() => {
    const getData = async () => {
      const chartRes = await http.get('/teacher/visibilitation/dolist')
      const barRes = await http.get('/teacher/visibilitation/classdata')
      const lineRes = await http.get('/teacher/visibilitation/datedata')
      setChartData(chartDataChange(chartRes.data.results))
      setBarData(barDataChange(barRes.data.results))
      setLineData(lineDataChange(lineRes.data.results))
    }
    getData()
  }, [])

  return (
    <div>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>

          <Chart
            data={chartData}
            title='题目'

          ></Chart>
          <Bar
            title='各班累计完成数'
            xData={barData.xData}
            yData={barData.yData}
          >
          </Bar>
        </div>
        <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
          <LineChart
            title='近十四日做题数'
            abscissa={lineData.xData}
            ordinate={lineData.yData}
          ></LineChart>
        </div>

      </Card>

    </div>
  )
}

export default Home