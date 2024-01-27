import { Box, Grid, Paper} from "@mui/material";
import { myTheme } from "../App/myTheme";
import MyGraph from "./Graph/MyGraphSimple";
import { GraphSeriesToggle } from "./GraphSeriesToggle";
import { ReactionRateInput } from "./ReactionRateInput";
import IntegralInput from "./IntegralInput";

type Content2Props = {
  expConcData:{[key:string]:number}[]
  calcConcData:{[key:string]:number}[]
  selectedDataKeys:{[key: string]: boolean}
  setSelectedDataKeys:(keys:{[key: string]: boolean})=>void;
  integralRange: {min:number, max:number},
  setIntegralRange:(range:{min:number, max:number})=>void;
  reactionRateConstant:{[key: string]: number}
  setReactionRateConstant:(reactionRateConstant:{[key: string]: number})=>void;
  handleCalcConcData:()=>void;
  optRanges: {id:string, opt:boolean, min:number, max:number}[]
  handleOptRanges: (newrange: {id: string,opt: boolean,min: number,max: number}[]) => void;
}

const Content2Main=(props:Content2Props)=>{

  const handleDataSlect=(data:{[key:string]:number}[],selectedDataKeys:{[key: string]: boolean})=>{
    const newSelectedData:{[key:string]:number}[] = data.map((data)=>{
      const entries = Object.entries(data).filter(([key,_])=>key==='id' || key==='time' || selectedDataKeys[key])
      return Object.fromEntries(entries)
    })
    return newSelectedData;
  }

  return (
    <Grid container spacing={1} display='flex' alignItems='center'>
      <Grid item xs={12}>
        <Paper>
          <Box sx={{width:"100%",height:"20vh",overflow:'auto',backgroundColor:myTheme.palette.grey[200],borderRadius:5}}>
            <IntegralInput
              integralRange={props.integralRange}
              setIntegralRange={props.setIntegralRange}
              handleCalcConcData={props.handleCalcConcData}
            />
            <ReactionRateInput
              reactionRateConstant={props.reactionRateConstant}
              setReactionRateConstant={props.setReactionRateConstant}
              optRanges={props.optRanges}
              handleOptRanges={props.handleOptRanges}
            />
          </Box>
        </Paper>
      </Grid>

      {/* <Grid item xs={6}>
      <Paper>
        <Box sx={{width:"100%",height:"20vh",overflow:'auto',backgroundColor:myTheme.palette.grey[200],borderRadius:5}}>

        </Box>
        </Paper>
      </Grid> */}

      <Grid item xs={1}>
        <Paper>
          <Box sx={{width:"100%",height:"65vh",overflow:'auto',backgroundColor:myTheme.palette.grey[200],borderRadius:5}}>
            <GraphSeriesToggle
              selectedDataKeys={props.selectedDataKeys}
              setSelectedDataKeys={props.setSelectedDataKeys}
            />
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={11}>
        <Paper>
          <Box sx={{width:'100%', height:'65vh'}}>
            <MyGraph
              expData={handleDataSlect(props.expConcData,props.selectedDataKeys)}
              calcData={handleDataSlect(props.calcConcData,Object.fromEntries(Object.entries(props.selectedDataKeys).map(([key,value])=>[key+'c',value])))}
            />
          </Box>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default Content2Main;
