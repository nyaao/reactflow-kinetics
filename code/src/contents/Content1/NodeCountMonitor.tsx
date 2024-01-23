import * as React from 'react';
import { Grid, Typography} from '@mui/material';
import { myTheme } from '../App/myTheme';
import { Node } from 'reactflow';

type NodeCountMonitorProps = {
  title:string,
  nodes:Node[],
}

export const NodeCountMonitor=(props:NodeCountMonitorProps)=>{
  return (
    <>
      <Grid container sx={{p:1,display:'flex',justifyContent:'center',alignItems:'center',height:'100%'}}>
        <Grid item xs={12}>
        <Typography sx={{fontSize:20,textAlign:'center',color:myTheme.palette.primary.dark}}>
          {props.title}
        </Typography>
        <Typography sx={{fontSize:36,textAlign:'center',color:myTheme.palette.primary.dark}}>
          {props.nodes.length}
        </Typography>
        </Grid>
      </Grid>
    </>
  );
}
