import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { NumberFormatValues, NumericFormat } from 'react-number-format';
import {Button,Typography,TextField} from '@mui/material';
import { useState } from 'react';

type Props = {
  open: boolean,
  onClose: (newrow?: {[key:string]:number}) => void,
  editingrow:{[key:string]:number}
}

export const ExpDataDialog=(props:Props)=>{
  const [tmpRow, setTmpRow] = useState<{[key:string]:number}>(props.editingrow);

  const handleClose=(v:string)=>{
    if(v==="OK"){
      const newrow = Object.assign({},tmpRow);
      props.onClose(newrow);
    }else if(v==="Cancel"){
      props.onClose();
    }
  }

  const handleOnValueChange=(values: NumberFormatValues,k: string)=>{
    const newtmprow = Object.assign({},
      tmpRow,
      {[k]:Number(values.value)}
      )
    setTmpRow(newtmprow)
  }

  return (
    <Dialog  open={props.open}>
      <Typography sx={{p:1}}>Set Experimantal Data [id:{tmpRow.id}]</Typography>
      <DialogContent>
        {
          Object.keys(tmpRow)
          .filter((k)=>k!=='id')
          .filter((k)=>k[0]!=='k'&&k[1]!=="_")
          .map((k)=>{
              return <div key={k}>
                      <NumericFormat
                        label={k}
                        customInput={TextField}
                        value={tmpRow[k]}
                        onValueChange={(values)=>handleOnValueChange(values,k)}
                        InputLabelProps={{ shrink: true }}
                      />
                    </div>
          })
        }
      </DialogContent>
      <DialogActions>
        <Button variant='contained' size="small" onClick={()=>handleClose("OK")}>OK</Button>
        <Button variant='contained' size="small" onClick={()=>handleClose("Cancel")}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
