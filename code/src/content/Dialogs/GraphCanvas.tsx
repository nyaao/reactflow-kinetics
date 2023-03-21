import * as React from 'react';
import { Line } from "react-chartjs-2";
import { ChartOptions } from 'chart.js';

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
  time:string[],
  data:number[][],
  label:string[],
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

export const GraphCanvas=(props:Props)=>{


  // const data_calc_A = [...Array(props.calc_T.length)].map((v,i)=>(
  //   {x:props.calc_T[i],y:props.calc_A[i]}
  // ))

  const data_calc = [...Array(props.data[0].length)].map((v,i)=>
    props.time.map((time,j)=>(
      {x:Number(time),y:props.data[j][i]}
      ))      
  )
  

  const graphData = {
    // datasets: [
    //   {
    //     label: "A",
    //     data: data_calc_A,
    //     borderColor: "blue",
    //     radius: 0,
    //     showLine:true
    //   },
    //   {
    //     label: "B",
    //     data: data_calc_B,
    //     borderColor: "orange",
    //     radius: 0,
    //     showLine:true
    //   },
    // ],
    datasets:data_calc.map((data,i)=>({
      label:props.label[i],
      data:data,
      borderColor: colors[i%8],
      radius:0,
      showLine:true
    }))
  };


  const options: ChartOptions<'line'> = {

    maintainAspectRatio: false,
    responsive: false,
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
      <div>
        <Line
          height={200}
          width={800}
          data={graphData}
          options={options}
          id="chart-key"
        />
      </div>
    </>
  );
}