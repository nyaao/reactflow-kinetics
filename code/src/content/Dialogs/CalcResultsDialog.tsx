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
  const [data, setData] = useState(Object.values(props.calculatedData));

  return (
    <Dialog  open={props.open}>
      <Typography sx={{p:1}}>Results</Typography>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Time</TableCell>
                {props.integrand.map((i)=><TableCell key={i} align="right">{i}</TableCell>)}
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
          calc_T={[0,50,100]}
          calc_A={[1,0.5,0]}
          calc_B={[0,0.5,1]}
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
