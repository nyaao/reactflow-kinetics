import * as React from 'react';
import {Box, Grid, Typography} from '@mui/material';
import { MathJax, MathJaxContext } from "better-react-mathjax"
import { fontSize } from '@mui/system';
import { myTheme } from '../myTheme';

type Props = {
  schemeData:{[key:string]:string}|null,
  rereadingData:{[key:string]:string}|null,
  identifier:string,
}

export const Infomation=(props:Props)=>{

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
      <Grid container sx={{p:1,display:'flex',justifyContent:'center',alignItems:'center',height:'100%'}}>
        <Grid item xs={12}>
        <Typography sx={{fontSize:20,textAlign:'center',color:myTheme.palette.primary.dark}}>
          {props.identifier==='Y' ? "【化学種】" :"【反応】"}
        </Typography>
        <Typography sx={{fontSize:36,textAlign:'center',color:myTheme.palette.primary.dark}}>
          {props.rereadingData!==null ? Object.keys(props.rereadingData).filter(key=>key[0]===props.identifier).length : 0}
        </Typography>
        </Grid>
      </Grid>
    </>
  );
}
