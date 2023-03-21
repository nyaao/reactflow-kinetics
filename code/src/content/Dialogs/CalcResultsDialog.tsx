import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { GraphCanvas } from './GraphCanvas';

type Props = {
  open: boolean,
  onClose: () => void,
  integrand:string[],
  calculatedData:{ [key: number]: number[]}
}

export const CalcResultsDialog=(props:Props)=>{
  const [time, setTime] = useState(Object.keys(props.calculatedData));
  const [rowdata, setRowData] = useState(Object.values(props.calculatedData));

  const mids = props.integrand.map(integ=>Number(integ.replace('Y[',"").replace("]","")))
  const data = rowdata.map((d)=>d.filter((_,i)=>mids.includes(i)))


  return (
    <Dialog  open={props.open}>
      <Button onClick={()=>console.log(
        
        )}>test</Button>
      <Typography sx={{p:1}}>Results</Typography>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Time</TableCell>
                {/* {[...props.integrand].sort().map((i)=><TableCell key={i} align="right">{i}</TableCell>)} */}
                {[...mids].sort((a,b)=>a-b).map((i)=><TableCell key={i} align="right">{i}</TableCell>)}
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
        <GraphCanvas
          time={time}
          data={data}
          label={[...mids].sort((a,b)=>a-b).map(mi=>"Y["+mi+"]")}
          xmin={0}
          xmax={100}
        />
      </DialogContent>
      <DialogActions>
        <Button variant='contained' size="small" onClick={()=>props.onClose()}>OK</Button>
      </DialogActions>
    </Dialog>
  );
}
