import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import {Button,Typography,TextField, Switch, FormControlLabel} from '@mui/material';
import { Edge } from 'reactflow';
import useEdgeDialog from '../../Hooks/useEdgeDialog';

type Props = {
  open: boolean,
  onClose: (newedge?: Edge) => void,
  edge:Edge
}

const generateTextField = (k: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, k: string) => void) => (
  <div key={k}>
    <TextField
      sx={{ p: 1 }}
      label={k}
      value={value}
      onChange={(e) => onChange(e, k)}
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

export const EdgeDialog=(props:Props)=>{
  const { tmpEdge, handleClose, handleOnChange, handleOnChangeNumber, handleOnChangeBoolean } = useEdgeDialog(props.edge, props.onClose);

  return (
    <Dialog  open={props.open}>
      <Typography sx={{p:1}}>Set Node Property [id:{tmpEdge.id}]</Typography>
      <DialogContent>
        {
          Object.entries<Record<string, Object>>(tmpEdge.data).map(([k,value])=>{
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

