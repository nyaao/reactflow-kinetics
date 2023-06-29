import * as React from 'react';
import {Box, Grid, Typography} from '@mui/material';
import { MathJax, MathJaxContext } from "better-react-mathjax"
import { fontSize } from '@mui/system';
import { myTheme } from '../myTheme';

type Props = {
  schemeData:{[key:string]:string}|null,
  rereadingData:{[key:string]:string}|null,
}

export const Formulae=(props:Props)=>{

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
    <Grid container sx={{p:1,display:'flex',justifyContent:'center',alignItems:'center',height:'100%'}}>
      <Grid item xs={12}>
        {/* <Typography sx={{fontSize:20,textAlign:'center',color:myTheme.palette.primary.dark}}>        
          【反応速度式】
        </Typography> */}
        <Box sx={{p:1}}>
        <MathJaxContext>
          {props.schemeData!==null && 
          Object.keys(props.schemeData)
              .map((key)=>(
              <MathJax key={key} style={{fontSize:18,padding:"5px"}}>
                  {(props.schemeData!==null && props.rereadingData!==null) && 
                  ("\\(\\frac{d"+props.rereadingData[key]+"}{dt} = "+handleRereading(props.schemeData[key]+"\\)",props.rereadingData))}
              </MathJax>
              ))
          }
        </MathJaxContext>
        </Box>
      </Grid>
    </Grid>
  );
}
