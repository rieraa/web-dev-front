import * as echarts from 'echarts'
import { useEffect, useRef } from 'react'


function Bar ({ title, xData, yData, style }) {


  const chartInit = (title, xData, yData, node) => {
    let myChart = echarts.init(
      node, null,
      {
        width: 700,
        height: 400
      }

    )
    // 绘制图表
    myChart.setOption({
      title: {
        text: title
      },
      tooltip: {},
      xAxis: {
        data: xData
      },
      yAxis: {},
      series: [
        {
          name: '完成数',
          type: 'bar',
          data: yData,
          barWidth: '20%'
        }
      ]
    })
  }
  const domRef = useRef(null)

  useEffect(() => {
    chartInit(title, xData, yData, domRef.current)
  }, [title, xData, yData])

  return (
    <div>
      <div ref={domRef} style={style}></div>
    </div>)
}
export default Bar