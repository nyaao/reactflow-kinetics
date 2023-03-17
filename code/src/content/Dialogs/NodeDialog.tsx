import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { NumberFormatValues, NumericFormat } from 'react-number-format';
import {Button,Typography,TextField, Stack} from '@mui/material';
import { Node } from 'reactflow';
import { useState } from 'react';
import { AntSwitch, getIntegratedVariableNo, getKineticConstantNo } from '../utils';

type Props = {
  open: boolean,
  onClose: (newnode?: Node) => void,
  node:Node
  nodes:Node[]
}

export const NodeDialog=(props:Props)=>{
  const [tmpNode, setTmpNode] = useState<Node>(props.node);

  const handleClose=(v:string)=>{
    if(v==="OK"){
      const newnode = Object.assign({},tmpNode);
      props.onClose(newnode);
    }else if(v==="Cancel"){
      props.onClose();
    }
  }
  
  const handleOnChange=(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,k: string)=>{
    // 対象のプロパティキーlabelにセットされているかどうか調べる
    const labelkey = Object.keys(tmpNode.data)
    .filter((key)=>key!=='label')
    .filter((key)=>tmpNode.data[key]===tmpNode.data.label)
    // labelにセットされている場合は、labelも書き換える
    const labeldata = {label:labelkey[0]===k? e.target.value : tmpNode.data.label}
    const newtmpnode = Object.assign({},
      tmpNode,
      {data:
        Object.assign({},
        tmpNode.data,
        labeldata,
        {[k]:e.target.value}
      )
      })
    setTmpNode(newtmpnode)
  }

  const handleOnValueChange=(values: NumberFormatValues,k: string)=>{
    // 対象のプロパティキーlabelにセットされているかどうか調べる
    const labelkey = Object.keys(tmpNode.data)
    .filter((key)=>key!=='label')
    .filter((key)=>tmpNode.data[key]===tmpNode.data.label)
    // labelにセットされている場合は、labelも書き換える
    const labeldata = {label:labelkey[0]===k? values.value : tmpNode.data.label}
    const newtmpnode = Object.assign({},
      tmpNode,
      {data:
        Object.assign({},
        tmpNode.data,
        labeldata,
        {[k]:Number(values.value)}
      )
      })
    setTmpNode(newtmpnode)
  }

  const handleOnCheckedChange=(e: React.ChangeEvent<HTMLInputElement>,k:string)=>{
    // 対象のプロパティキーlabelにセットされているかどうか調べる
    const labelkey = Object.keys(tmpNode.data)
    .filter((key)=>key!=='label')
    .filter((key)=>tmpNode.data[key]===tmpNode.data.label)
    // labelにセットされている場合は、labelも書き換える

    const labeldata = {label:labelkey[0]===k? e.target.value : tmpNode.data.label}
    const newtmpnode = Object.assign({},
      tmpNode,
      {data:
        Object.assign({},
        tmpNode.data,
        labeldata,
        {[k]:!tmpNode.data.isOpen}
      )
      })
    setTmpNode(newtmpnode)
  }

  return (
    <Dialog  open={props.open}>
      <Typography sx={{p:1}}>Set Node Property [id:{tmpNode.id}]</Typography>
      <DialogContent>
        {
          Object.keys(tmpNode.data)
          .filter((k)=>k!=='src')
          .filter((k)=>k!=='label')
          .map((k)=>{
            if(typeof(tmpNode.data[k])==='string'){
              return <div key={k}>
                      <TextField
                        label={k}
                        value={tmpNode.data[k]}
                        onChange={(e)=>handleOnChange(e,k)}
                        InputLabelProps={{shrink:true}}
                      />
                    </div>
            }else if(
              (typeof(tmpNode.data[k])==='number' && tmpNode.type==="reaction" && k==="reactionRateConstant") ||
              (typeof(tmpNode.data[k])==='number' && tmpNode.type==="reactant" && k==="initialConcentration") ||
              (typeof(tmpNode.data[k])==='number' && tmpNode.type==="intermediate" && k==="initialConcentration") ||
              (typeof(tmpNode.data[k])==='number' && tmpNode.type==="product" && k==="initialConcentration")
              ){
              return <div key={k}>
                      <NumericFormat
                        label={tmpNode.type==="reaction" ? "k[" + getKineticConstantNo(props.nodes,tmpNode)+"]" : "y["+getIntegratedVariableNo(props.nodes,tmpNode)+"]"}
                        customInput={TextField}
                        value={tmpNode.data[k]}
                        onValueChange={(values)=>handleOnValueChange(values,k)}
                        InputLabelProps={{ shrink: true }}
                      />
                    </div>
            }else if(typeof(tmpNode.data[k])==='boolean'){
              return(
                <Stack direction="row" spacing={1} alignItems="center" key={k}>
                  <Typography>close</Typography>
                  <AntSwitch checked={tmpNode.data.isOpen} onChange={(e)=>handleOnCheckedChange(e,k)} inputProps={{ 'aria-label': 'ant design' }} />
                  <Typography>open</Typography>
                </Stack>
              )
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
