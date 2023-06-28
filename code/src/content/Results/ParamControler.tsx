import { Grid, Stack, TextField, Button, Typography } from "@mui/material"
import { NumericFormat } from "react-number-format"
import { myTheme } from "../myTheme"
import { AntSwitch } from "../utils"
import { Node } from "reactflow"

type Props ={
    time: {min: number,max: number},
    setTime:(time:{min:number,max:number})=>void
    setState:(stae:"param"|"data")=>void,
    nodes:Node[],
    setNodes:(nodes:Node[])=>void
}

export const ParamControler=(props:Props)=>{
  return (
    <>
      <Grid item xs={2}>
        <Button onClick={()=>props.setState('data')}disableElevation size="small" variant='outlined' sx={{margin:'2px', color:myTheme.palette.grey[400],borderColor:myTheme.palette.grey[400]}}>切替</Button>
      </Grid>
      <Grid item xs={10}>
        <Stack direction="row" sx={{display:'flex', justifyContent:'space-between'}} spacing={1} alignItems="center">
          {/* <NumericFormat
          label={"time_min"}
          customInput={TextField}
          value={props.time.min}
          onValueChange={(values)=>setTime({min:Number(values.value),max:time.max})}
          InputLabelProps={{ shrink: true }}
          style={{paddingRight:8}}
          /> */}
          <NumericFormat
            label={"time_max"}
            customInput={TextField}
            value={props.time.max}
            onValueChange={(values)=>props.setTime({max:Number(values.value),min:props.time.min})}
            InputLabelProps={{ shrink: true }}
            style={{paddingRight:8}}
          />
        </Stack>
        {props.nodes.filter(n=>n.type=='reaction').map(rn=>{
          return <Grid item xs={12}> 
            <Stack direction="row" spacing={1} alignItems="center" key={rn.id}>
                <NumericFormat
                label={rn.id.replace('r','k')}
                key={rn.id}
                customInput={TextField}
                value={rn.data.kinetic_constant}
                onValueChange={(values)=>{
                    const newnodedata = Object.assign({},rn.data,{kinetic_constant:Number(values.value)});
                    const newnode = Object.assign({},rn,{data:newnodedata});
                    const newnodes = [...props.nodes.filter(n=>n.id!==rn.id),newnode].sort((a,b)=>Number(a.id.replace('r','')) - Number(b.id.replace('r','')));
                    props.setNodes(newnodes);
                }}
                InputLabelProps={{ shrink: true }}
                style={{paddingRight:8}}
                />
                <Typography>off</Typography>
                <AntSwitch checked={true} onChange={(e)=>console.log(e)} inputProps={{ 'aria-label': 'ant design' }} />
                <Typography>on</Typography>
            </Stack>          
          </Grid>
          })}
      </Grid>
    </>
  )
}