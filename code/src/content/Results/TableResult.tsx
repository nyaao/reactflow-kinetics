import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { Node } from 'reactflow';

type Props = {
  integrand:string[],
  calculatedData:{ [key: number]: number[]}
  nodes:Node[],
}

export const TableResult=(props:Props)=>{
  const time = Object.keys(props.calculatedData);
  const rowdata = Object.values(props.calculatedData);
  const mids = props.integrand.map(integ=>Number(integ.replace('Y[',"").replace("]","")))
  const data = rowdata.map((d)=>d.filter((_,i)=>mids.includes(i)))
  
  const data_selected = rowdata.map((d)=>d.filter((_,i)=>mids.includes(i)));

  const plot_data = [...Array(data_selected[0].length)].map((v,i)=>
    time.map((time,j)=>(
        {x:Number(time),y:data_selected[j][i]}
    ))
  );
  const label=[...mids].sort((a,b)=>a-b).map(mi=>"Y["+mi+"]");
  const symbols=[...mids].sort((a,b)=>a-b).map(mi=>props.nodes.filter(n=>n.id==="m"+mi)[0]).map(n=>n.data.symbol);


  return (
    <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} size="small" aria-label="a dense table">
        <TableHead>
            <TableRow>
            <TableCell>Time</TableCell>
            {[...mids].sort((a,b)=>a-b).map((i)=><TableCell key={i} align="right">{"Y["+i+"]"}</TableCell>)}
            </TableRow>
        </TableHead>
        <TableBody>
            {time.map((t,i)=>
            <TableRow
                key={t}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
                <TableCell key={t} component="th" scope="row">
                {t}
                </TableCell>
                {data[i].map((d,j)=>
                <TableCell key={i+j} align="right">{d.toFixed(3)}</TableCell>
                )}
            </TableRow>
            )}
        </TableBody>
        </Table>
    </TableContainer>
  );
}