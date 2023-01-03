import Bar from "@/components/Bar"
import Chart from "@/components/Chart"
import LineChart from "@/components/LineChart"
import { Card } from "antd";


const Home = () => {

  const chartData = [
    { value: 1048, name: '必做题' },
    { value: 735, name: '选做题' },
  ]
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
            xData={['一班', '二班', '三班']}
            yData={[60, 70, 80]}
          >
          </Bar>
        </div>
        <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
          <LineChart
            title='近七日做题数'
            abscissa={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
            ordinate={[820, 932, 901, 934, 1290, 1330, 1320]}
          ></LineChart>
        </div>

      </Card>

    </div>
  )
}

export default Home