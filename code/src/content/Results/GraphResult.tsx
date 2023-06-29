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
  expData:{[key:string]:number}[],
  rereadingData: {[key:string]:string}|null,
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
  const calc_data = data_selected.length>0 ? [...Array(data_selected[0].length)].map((v,i)=>
    time.map((time,j)=>(
        {x:Number(time),y:data_selected[j][i]}
    ))
  ):[];

  const time_exp = props.expData.map(data=>data.time);
  const selected_key = props.integrand.map(integ=>props.rereadingData!==null ? props.rereadingData[integ]:"")
  const show_key = props.expData.length>0 ? Object.keys(props.expData[0]).filter(key=>key!!=='id').filter(key=>key!=='time').filter(k=>selected_key.includes(k)) : [];

  const exp_data = show_key.length>0 ? show_key.map((key)=>
    props.expData.map((data)=>(
      {x:data.time,y:data[key]}
      ))
  )
  :[];

  const label=[...mids].sort((a,b)=>a-b).map(mi=>"Y["+mi+"]");
  const symbols=[...mids].sort((a,b)=>a-b).map(mi=>props.nodes.filter(n=>n.id==="m"+mi)[0]).map(n=>n.data.symbol);
  
  const graphData = {
    datasets:[
      ...calc_data.map((data,i)=>({
        label:symbols[i] === '' ? label[i] : symbols[i],
        data:data,
        borderColor: colors[i%8],
        radius:0,
        showLine:true
      })),
      ...exp_data.map((data,i)=>({
        label:symbols[i] === '' ? label[i]+"_exp" : symbols[i]+"_exp",
        data:data,
        borderColor: colors[i%8],
        pointBackgroundColor: colors[i%8], 
        radius:3,
        showLine:false
      })),
    ]
  };

  const options: ChartOptions<'line'> = {

    maintainAspectRatio: false,
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
            return items.text.indexOf('_exp')===-1
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
      <div style= {{width:'100%', height:'60vh'}}>
      {/* <div> */}
        {/* <Button onClick={()=>console.log(time_exp,show_key,calc_data,exp_data,props.expData)}>test</Button> */}
        <Line
          data={graphData}
          options={options}
          id="chart-key"
        />
      </div>
    </>
  );
}