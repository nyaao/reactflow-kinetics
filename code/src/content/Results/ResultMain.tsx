import { Box, Grid, Paper } from "@mui/material"
import { myTheme } from "../myTheme"
import { GraphResult } from "./GraphResult"

type Props={
  schemeData:{[key:string]:string}|null
  calculatedData:{ [key: number]: number[]},
  nodes:Node[],
  xmin:number,
  xmax:number,
}

export const ResultMain=(props:Props)=>{
  return(
    <Grid container spacing={1} display='flex' alignItems='center'>
      <Grid item xs={12}>
        <Paper>
          <Box sx={{width:"100%",height:"60vh",overflow:'auto',backgroundColor:myTheme.palette.grey[200],borderRadius:5}}>
            <GraphResult
              integrand={props.schemeData!==null ? Object.keys(props.schemeData):[]}
              calculatedData={props.calculatedData}
              nodes={[]}
              xmin={0}
              xmax={100}
            />
          </Box>
        </Paper>
      </Grid>        
      <Grid item xs={12}>
        <Paper>
          <Box sx={{width:"100%",height:"25vh",overflow:'auto',backgroundColor:myTheme.palette.grey[200],borderRadius:5}}>
          </Box>
        </Paper>
      </Grid>              
    </Grid>
  )
}