import { Box, Button, Checkbox, FormControlLabel, FormGroup, Grid, Paper, TextField} from "@mui/material";
import { myTheme } from "../myTheme";
import { GraphResult } from "./GraphResult";
import { Formulae } from "../Diagram/Formulae";
import { calc2 } from "../submit"
import { Node } from 'reactflow';
import { NumericFormat } from "react-number-format";
import { useState } from "react";

type Props={
  schemeData:{[key:string]:string}|null
  calculatedData:{[key: number]: number[]},
  nodes:Node[],
  setNodes: React.Dispatch<React.SetStateAction<Node<any, string | undefined>[]>>,
  xmin:number,
  xmax:number,
  rereadingData: {[key:string]:string}|null,
  setCalculateData:(data:{[key: number]: number[]})=>void
}

export const ResultMain=(props:Props)=>{
  const [time, setTime] = useState({min:0,max:100});
  const [calculating, setCalculating] = useState(false);
  const [showGraphFlags, setShowGraphFlags] = useState(props.schemeData!==null ?
    Object.assign({},...Object.keys(props.schemeData).map(key=>({[key]:true})))
    :
    null
    )

  const handleChangeShowGraphFlags=(key:string,value: boolean)=>{
    const newflags = Object.assign({},showGraphFlags,{[key]:value})
    setShowGraphFlags(newflags);
  }

  const handleCalc=async()=>{
    if(props.rereadingData!==null && props.schemeData!==null){
      const initY:{[key:string]:number} = Object.assign({},...props.nodes.filter(n=>n.type!=="reaction")
                                              .map(rip=>({["Y["+rip.id.replace("m","")+"]"]:rip.data.initial_concentration})))
      const params:{[key:string]:number} = Object.assign({},...props.nodes.filter(n=>n.type==='reaction')
                                              .map(rn=>({["k["+rn.id.replace("r","")+"]"]:rn.data.kinetic_constant})))
      const res = await calc2(props.schemeData,initY,params,time);
      const data = typeof(res.data)==='object' ? res.data : JSON.parse(res.data) //lambdaの場合は文字列で返してくる
      console.log(data);
      props.setCalculateData(data);
    }
  }

  return(
    <>
      <Grid item xs={6}>
        <Paper>
          <Box sx={{width:"100%",height:"20vh",overflow:'auto',backgroundColor:myTheme.palette.grey[200],borderRadius:5}}>
          <Grid container p={2} spacing={1} sx={{display:'flex',justifyContent:'center',alignItems:'top',height:'100%'}}>
            <Grid item xs={12}>
              <NumericFormat
                label={"time_min"}
                customInput={TextField}
                value={time.min}
                onValueChange={(values)=>setTime({min:Number(values.value),max:time.max})}
                InputLabelProps={{ shrink: true }}
                style={{paddingRight:8}}
              />
              <NumericFormat
                label={"time_max"}
                customInput={TextField}
                value={time.max}
                onValueChange={(values)=>setTime({max:Number(values.value),min:time.min})}
                InputLabelProps={{ shrink: true }}
                style={{paddingRight:8}}
              />
            </Grid>
            <Grid item xs={12}>
              {props.nodes.filter(n=>n.type=='reaction').map(rn=>{
                return <NumericFormat
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
                })
                }
            </Grid>
          </Grid>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={6}>
        <Paper>
          <Box sx={{width:"100%",height:"20vh",overflow:'auto',backgroundColor:myTheme.palette.grey[200],borderRadius:5}}>
            <Formulae
              rereadingData={props.rereadingData}
              schemeData={props.schemeData}
            />
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={1}>
        <Paper>
          <Box sx={{width:"100%",height:"65vh",overflow:'auto',backgroundColor:myTheme.palette.grey[200],borderRadius:5}}>
            <Grid container p={1} direction={'column'}>

              <Grid item xs={12}>
                <FormGroup>
                {props.schemeData!==null && Object.keys(props.schemeData).map(key=>{
                  return <FormControlLabel 
                          control={<Checkbox 
                                    checked={showGraphFlags[key]}
                                    onChange={(e)=>handleChangeShowGraphFlags(key,e.target.checked)}
                                  />}
                          label={props.rereadingData!==null && props.rereadingData[key]} 
                        />
                })}
                </FormGroup>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Grid>  
      <Grid item xs={11}>
        <Paper>
          <Box sx={{width:"100%",height:"65vh",overflow:'auto',backgroundColor:myTheme.palette.grey[200],borderRadius:5}}>
            <Button fullWidth style={{backgroundColor:myTheme.palette.primary.light}} disabled={calculating}
              onClick={()=>{
              setCalculating(true);
              handleCalc().then(()=>setCalculating(false))
            }}>{calculating ? "計算中…" : (Object.keys(props.calculatedData).length>0 ? "再計算": "計算")}</Button>
            <GraphResult
              integrand={(props.schemeData!==null && showGraphFlags!==null) ? Object.keys(props.schemeData).filter(key=>showGraphFlags[key]===true):[]}
              calculatedData={props.calculatedData}
              nodes={props.nodes}
              xmin={time.min}
              xmax={time.max}
            />
          </Box>
        </Paper>
      </Grid>
    </>
  )
}