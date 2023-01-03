import * as echarts from 'echarts'
import { useRef, useEffect } from 'react'

function Chart ({ data, title, style }) {
  let chartRef = useRef(null)
  const chartInit = (data, title, node) => {
    let myChart = echarts.init(
      node, null,
      {
        width: 400,
        height: 400
      }
    )
    
    let option
    option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
        left: 'center'
      },
      series: [
        {
          name: title,
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '20',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: data
        }
      ]
    }
    myChart.setOption(option)
  }

  useEffect(() => {
    chartInit(data, title, chartRef.current)
  }, [data, title])
  return (
    <div>
      <div ref={chartRef} style={style}></div>
    </div>
  )
}

export default Chart
