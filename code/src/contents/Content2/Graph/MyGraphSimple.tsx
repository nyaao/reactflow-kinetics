import { YAxis } from "recharts"
import { ResponsiveContainer,ComposedChart, XAxis, CartesianGrid, Tooltip, Line, Scatter, Legend } from "recharts"

const colors = ['#FF4B00','#005AFF','#03AF7A','#4DC4FF','#F6AA00','#FFF100','#000000','#990099','#84919E']

type Props = {
  expData:{[key:string]:number}[]
  calcData:{[key:string]:number}[]
}

const MyGraph=(props:Props)=>{
  const legendsExp = Object.keys(props.expData[0]).filter((key)=>key !== 'time' && key !== 'id').sort();
  const legendsCalc = Object.keys(props.calcData[0]).filter((key)=>key !== 'time' && key !== 'id').sort();

  return(
    <div style={{ height:'65vh',padding: '10px', margin:'0px' }}>
      <ResponsiveContainer width="100%">
        <ComposedChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" type='number' domain={["dataMin", "dataMax"]}/>
          <YAxis />
          {legendsCalc.map((legend:string,i:number)=>(
            <Line
              key={legend}
              type="linear"
              isAnimationActive={false}
              dataKey={legend}
              data={props.calcData}
              dot={false}
              stroke={colors[i%colors.length]}
            />
          ))}
          {legendsExp.map((legend:string,i:number)=>(
            <Scatter
              key={legend}
              isAnimationActive={false}
              dataKey={legend}
              data={props.expData}
              fill={colors[i%colors.length]}
              shape="circle"
            />
          ))}
          <Tooltip />
          <Legend />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

  export default MyGraph;
