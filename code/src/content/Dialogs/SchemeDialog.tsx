import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import {Button, DialogTitle, DialogContentText} from '@mui/material';
import { MathJax, MathJaxContext } from "better-react-mathjax"

type Props = {
  open: boolean,
  onClose: () => void,
  schemedata:{[key:string]:string}|null,
  rereadingdata:{[key:string]:string}|null,
}

export const SchemeDialog=(props:Props)=>{

  const handleClose=(v:string)=>{
    if(v==="OK"){
      props.onClose();
    }else if(v==="Cancel"){
      props.onClose();
    }
  }

  const handleRereading=(s:string, rereading:{[k:string]:string})=>{
    let text = s;
    if(rereading!==null){
      Object.keys(rereading).map((k)=>{
        // 正規表現を使う書き方にすればスマートになるはず
        text = text.replace(k ,rereading[k]).replace(k ,rereading[k]).replace(k ,rereading[k]).replace(k ,rereading[k]);
      })
    }
    return text.replace(/^\+/g,"").replace(/\*/g,"")
  }

  return (
    <Dialog  open={props.open}>
      <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
        Reaction Scheme
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
        <MathJaxContext>
          {props.schemedata!==null && 
            Object.keys(props.schemedata)
              .map((key)=>(
                <MathJax key={key} >
                  {(props.schemedata!==null && props.rereadingdata!==null) && 
                    ("\\(\\frac{d"+props.rereadingdata[key]+"}{dt} = "+handleRereading(props.schemedata[key]+"\\)",props.rereadingdata))}
                </MathJax>
              ))
            }
        </MathJaxContext>
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button variant='contained' size="small" onClick={()=>handleClose("OK")}>OK</Button>
      </DialogActions>
    </Dialog>
  );
}
