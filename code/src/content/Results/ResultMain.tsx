import { Box, Button, Checkbox, FormControlLabel, FormGroup, Grid, Paper, Stack, TextField, Typography} from "@mui/material";
import { myTheme } from "../myTheme";
import { GraphResult } from "./GraphResult";
import { Formulae } from "../Diagram/Formulae";
import { calc2 } from "../submit"
import { Node } from 'reactflow';
import { MouseEvent, useState } from "react";
import { ExpTable } from "./ExpTable";
import { ParamControler } from "./ParamControler";

type Props={
  schemeData:{[key:string]:string}|null
  calculatedData:{[key: number]: number[]},
  nodes:Node[],
  setNodes: React.Dispatch<React.SetStateAction<Node<any, string | undefined>[]>>,
  xmin:number,
  xmax:number,
  rereadingData: {[key:string]:string}|null,
  setCalculateData:(data:{[key: number]: number[]})=>void,
  expData:{[key:string]:number}[],
  setExpData:(data:{[key:string]:number}[])=>void
}

export const ResultMain=(props:Props)=>{
  const [time, setTime] = useState({min:0,max:100});
  const [calculating, setCalculating] = useState(false);
  const [state, setState] = useState<'param'|'data'>('data');
  const [showGraphFlags, setShowGraphFlags] = useState(props.schemeData!==null ?
    Object.assign({},...Object.keys(props.schemeData).map(key=>({[key]:true})))
    :
    null
    )
  
  const [paperSizes, setPaperSizes] = useState([
    {xs:6,height:"20vh"},
    {xs:6,height:"20vh"},
    {xs:1,height:"65vh"},
    {xs:11,height:"65vh"},
  ]);

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

  const handlePaperSizes=(e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,i:number)=>{
    if(e.shiftKey===true){
      if(i===0 && paperSizes[0].xs===6){
        const newsizes = [
          {xs:11,height:"65vh"},
          {xs:1,height:"65vh"},
          {xs:1,height:"20vh"},
          {xs:11,height:"20vh"},        
        ]
        setPaperSizes(newsizes);
      }
      else if(i===1 && paperSizes[0].xs===6){
        const newsizes = [
          {xs:5,height:"65vh"},
          {xs:7,height:"65vh"},
          {xs:1,height:"20vh"},
          {xs:11,height:"20vh"},        
        ]
        setPaperSizes(newsizes);
      }
      else if(i===3 && paperSizes[3].height==="65vh"){
        const newsizes = [
          {xs:6,height:"10vh"},
          {xs:6,height:"10vh"},
          {xs:1,height:"75vh"},
          {xs:11,height:"75vh"},        
        ]
        setPaperSizes(newsizes);
      }else{
        const newsizes = [
          {xs:6,height:"20vh"},
          {xs:6,height:"20vh"},
          {xs:1,height:"65vh"},
          {xs:11,height:"65vh"},        
        ]
        setPaperSizes(newsizes);
      }
    }
  }

  return(
    <>
      <Grid item xs={paperSizes[0].xs}>
        <Paper onDoubleClick={(e)=>handlePaperSizes(e,0)} >
          <Box sx={{width:"100%",height:paperSizes[0].height,overflow:'auto',backgroundColor:myTheme.palette.grey[200],borderRadius:5}}>
          <Grid container p={2} spacing={1} sx={{display:'flex',justifyContent:'center',alignItems:'top',height:'100%'}}>
            {state==='param' &&
              <ParamControler
                setState={setState}
                time={time}
                setTime={setTime}
                nodes={props.nodes}
                setNodes={props.setNodes}
              />
              
            }
            {state==='data' &&
              <ExpTable
                setState={setState}
                expData={props.expData.length === 0 ? 
                  (props.rereadingData!==null ?
                    [Object.assign({},{id:0,time:0},...Object.values(props.rereadingData).filter(key=>key[0]!=='k').map(symbol=>({[symbol]:0.0})))]
                    :
                    [{id:0,time:0}]
                  )
                  : 
                  props.expData}
                setExpData={props.setExpData}
              />
            }
          </Grid>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={paperSizes[1].xs}>
        <Paper onDoubleClick={(e)=>handlePaperSizes(e,1)}>
          <Box sx={{width:"100%",height:paperSizes[1].height,overflow:'auto',backgroundColor:myTheme.palette.grey[200],borderRadius:5}}>
            <Formulae
              rereadingData={props.rereadingData}
              schemeData={props.schemeData}
            />
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={paperSizes[2].xs}>
        <Paper onDoubleClick={(e)=>handlePaperSizes(e,2)}>
          <Box sx={{width:"100%",height:paperSizes[2].height,overflow:'auto',backgroundColor:myTheme.palette.grey[200],borderRadius:5}}>
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

      <Grid item xs={paperSizes[3].xs}>
        <Paper onDoubleClick={(e)=>handlePaperSizes(e,3)}>
          <Box sx={{width:"100%",height:paperSizes[3].height,overflow:'auto',backgroundColor:myTheme.palette.grey[200],borderRadius:5}}>
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
              expData={props.expData}
              rereadingData={props.rereadingData}
            />
          </Box>
        </Paper>
      </Grid>

    </>
  )
}