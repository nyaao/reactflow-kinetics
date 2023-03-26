import * as React from 'react';
import {Button, DialogTitle, DialogContentText, Typography} from '@mui/material';
import { MathJax, MathJaxContext } from "better-react-mathjax"

type Props = {
  schemedata:{[key:string]:string}|null,
  rereadingdata:{[key:string]:string}|null,
}

export const SchemeResult=(props:Props)=>{

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
    <>
      <Typography>
        Derivative Scheme
      </Typography>
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
    </>
  );
}
