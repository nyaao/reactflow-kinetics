import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { NumberFormatValues, NumericFormat } from 'react-number-format';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Edge } from 'reactflow';
import { useState } from 'react';

type Props = {
  open: boolean,
  onClose: (newedge?: Edge) => void,
  edge:Edge
}

export const EdgeDialog=(props:Props)=>{
  const [tmpEdge, setTmpEdge] = useState<Edge>(props.edge);

  const handleClose=(v:string)=>{
    if(v==="OK"){
      const newedge = Object.assign({},tmpEdge);
      props.onClose(newedge);
    }else if(v==="Cancel"){
      props.onClose();
    }
  }

  const handleOnChange=(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,k: string)=>{
    // 対象のプロパティキーlabelにセットされているかどうか調べる
    const labelkey = Object.keys(tmpEdge.data).filter((key)=>tmpEdge.data[key]===tmpEdge.label)
    // labelにセットされている場合は、labelも書き換える
    const labeldata = {label:labelkey[0]===k? e.target.value : tmpEdge.label}
    const newtmpedge = Object.assign({},
      tmpEdge,
      labeldata,
      {data:
        Object.assign({},
        tmpEdge.data,
        {[k]:e.target.value}
      )
      })
    setTmpEdge(newtmpedge)
  }

  const handleOnValueChange=(values: NumberFormatValues,k: string)=>{
    // 対象のプロパティキーlabelにセットされているかどうか調べる
    const labelkey = Object.keys(tmpEdge.data).filter((key)=>tmpEdge.data[key]===tmpEdge.label)
    // labelにセットされている場合は、labelも書き換える
    const labeldata = {label:labelkey[0]===k? values.value : tmpEdge.label}
    const newtmpedge = Object.assign({},
      tmpEdge,
      labeldata,
      {data:
        Object.assign({},
        tmpEdge.data,
        {[k]:values.value}
      )
      })
    setTmpEdge(newtmpedge)
  }

  return (
    <Dialog  open={props.open}>
      <Typography sx={{p:1}}>Set Edge Property [id:{tmpEdge.id}]</Typography>
      <DialogContent>
        {
          Object.keys(tmpEdge.data).map((k)=>{
            if(typeof(tmpEdge.data[k])==='string'){
              return <div key={k}>
                      <TextField
                        label={k}
                        value={tmpEdge.data[k]}
                        onChange={(e)=>handleOnChange(e,k)}
                        InputLabelProps={{shrink:true}}
                      />
                    </div>
            }else if(typeof(tmpEdge.data[k])==='number'){
              return <div key={k}>
                      <NumericFormat
                        label={k}
                        customInput={TextField}
                        value={tmpEdge.data[k]}
                        onValueChange={(values)=>handleOnValueChange(values,k)}
                        InputLabelProps={{ shrink: true }}
                      />
                    </div>
            }
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
