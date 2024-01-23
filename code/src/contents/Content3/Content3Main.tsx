import { Box, Grid, Paper } from "@mui/material";
import { myTheme } from "../App/myTheme";
import { TableEditable } from "./Table/MyTableEditable";

type Content3Props = {
  data:{[key:string]:number}[]
  setData:(data:{[key:string]:number}[])=>void
}

const Content3Main=(props:Content3Props)=>{
  return (
    <Grid container spacing={1} display='flex' alignItems='center'>
      <Grid item xs={6}>
        <Paper>
          <Box sx={{width:"100%",height:"20vh",overflow:'auto',backgroundColor:myTheme.palette.grey[200],borderRadius:5}}>

          </Box>
        </Paper>
      </Grid>

      <Grid item xs={6}>
      <Paper>
        <Box sx={{width:"100%",height:"20vh",overflow:'auto',backgroundColor:myTheme.palette.grey[200],borderRadius:5}}>

        </Box>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper>
          <Box sx={{width:'100%', height:'65vh'}}>
            <TableEditable
              data={props.data}
              setData={props.setData}
              />
          </Box>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default Content3Main;
