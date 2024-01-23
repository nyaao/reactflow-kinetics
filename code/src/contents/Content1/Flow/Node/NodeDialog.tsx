import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import {Button,Typography,TextField, Switch, FormControlLabel} from '@mui/material';
import { Node } from 'reactflow';
import useNodeDialog from '../../Hooks/useNodeDialog';

type Props = {
  open: boolean,
  onClose: (newnode?: Node) => void,
  node:Node
}

const generateTextField = (k: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, k: string) => void) => (
  <div key={k}>
    <TextField
      sx={{ p: 1 }}
      label={k}
      value={value}
      onChange={(e) => onChange(e, k)}
      disabled={value==='--'}
    />
  </div>
);

const generateSwitchField = (k: string, value: boolean, onChange: (k: string) => void) => (
  <div key={k}>
    <FormControlLabel
      label={`${k} boolean`}
      labelPlacement="start"
      control={<Switch checked={value} onChange={(e) => onChange(k)} />}
    />
  </div>
);

export const NodeDialog=(props:Props)=>{
  const { tmpNode, handleClose, handleOnChange, handleOnChangeNumber, handleOnChangeBoolean } = useNodeDialog(props.node, props.onClose);

  return (
    <Dialog  open={props.open}>
      <Typography sx={{p:1}}>Set Node Property [id:{tmpNode.id}]</Typography>
      <DialogContent>
        {
          Object.entries<Record<string, Object>>(tmpNode.data).map(([k,value])=>{
              if(value.type===String){
                return generateTextField(k, String(value.value), handleOnChange)
              }else if(value.type===Number){
                return generateTextField(k, String(value.value), handleOnChangeNumber)
              }else if(value.type===Boolean){
                return generateSwitchField(k,Boolean(value.value),handleOnChangeBoolean)
              }
              return null;
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

