import * as echarts from 'echarts'
import { useRef, useEffect } from 'react'

export default function LineChart ({ title, abscissa, ordinate, style }) {
  let chartRef = useRef(null)
  const chartInit = (title, abscissa, ordinate, node) => {
    // 初始化图表
    let myChart = echarts.init(

      node,
      null,
      {
        width: 1200,
        height: 400
      }
    )

    // 图表所需数据
    let option = {
      title: {
        text: title
      },
      xAxis: {
        type: 'category',
        data: abscissa
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: ordinate,
          type: 'line',
          smooth: true
        }
      ]
    }
    myChart.setOption(option)
  }

  useEffect(() => {
    chartInit(title, abscissa, ordinate, chartRef.current)
  }, [title, abscissa, ordinate,])
  return (
    <div>
      <div ref={chartRef} style={style}></div>
    </div>
  )
}


