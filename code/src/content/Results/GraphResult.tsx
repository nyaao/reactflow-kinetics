import * as React from 'react';
import { Line } from "react-chartjs-2";
import { ChartOptions } from 'chart.js';
import {Node} from 'reactflow';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Decimation,
  Colors
} from "chart.js";
import { Button } from '@mui/material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Decimation,
  Colors
);

type Props = { 
  integrand:string[],
  calculatedData:{ [key: number]: number[]},
  nodes:Node[],
  xmin:number,
  xmax:number,
}

const colors=[
  "#FF3333",
  "#FF9933",
  "#33FF33",
  "#33FFFF",
  "#3333FF",
  "#9933FF",
  "#FF33FF",
  "#A0A0A0",
]

export const GraphResult=(props:Props)=>{
  const time = Object.keys(props.calculatedData);
  const rowdata = Object.values(props.calculatedData);
  const mids = props.integrand.map(integ=>Number(integ.replace('Y[',"").replace("]","")))
  const data_selected = rowdata.map((d)=>d.filter((_,i)=>mids.includes(i)));

  const plot_data = data_selected.length>0 ? [...Array(data_selected[0].length)].map((v,i)=>
    time.map((time,j)=>(
        {x:Number(time),y:data_selected[j][i]}
    ))
  ):[];
  const label=[...mids].sort((a,b)=>a-b).map(mi=>"Y["+mi+"]");
  const symbols=[...mids].sort((a,b)=>a-b).map(mi=>props.nodes.filter(n=>n.id==="m"+mi)[0]).map(n=>n.data.symbol);
  
  const graphData = {
    datasets:plot_data.map((data,i)=>({
      label:symbols[i] === '' ? label[i] : symbols[i],
      data:data,
      borderColor: colors[i%8],
      radius:0,
      showLine:true
    }))
  };


  const options: ChartOptions<'line'> = {

    maintainAspectRatio: true,
    responsive: true,
    aspectRatio:3,
    animation: false,
    parsing: false,
    interaction: {
      mode: 'nearest',
      axis: "x",
      intersect: false,
    },
    plugins: {
      title: {
        // display: true,
        // text: 'Title',
      },
      legend :{
        labels: {
          filter: function(items:any){
            return items.text !== 'ex_A' && items.text !=='ex_B' && items.text !=='ex_C' && items.text !=='ex_D' && items.text !=='ex_E'
          }
        },
      },
      decimation: {
        enabled: false,
        algorithm: 'lttb',
        samples: 100
      },
    },

    scales: {
      x: {
        type: 'linear',
        display: true,
        position: 'left' as const,
        min: props.xmin,
        max: props.xmax
      },
    },
  };


  return (
    <>
      {/* <div style= {{width:'100%', height:'60vh'}}> */}
      <div>
        <Line
          // height={'100vh'}
          // width={'800%'}
          data={graphData}
          options={options}
          id="chart-key"
          // style={{position: "relative", width:'100%', height:'60vh'}}
        />
      </div>
    </>
  );
}