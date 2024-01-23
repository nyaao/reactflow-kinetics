import { Grid, Stack, TextField, Button } from "@mui/material";
import { useEffect, useState } from "react";
import formatNumericText from '../functions/formatNumericText'

type Props={
  integralRange: {min:number, max:number},
  setIntegralRange:(range:{min:number, max:number})=>void;
  handleCalcConcData:()=>void;
}

const IntegralInput=(props:Props)=>{
  const [tmpRange, setTmpRange] = useState<{min:string,max:string}>({min:String(props.integralRange.min),max:String(props.integralRange.max)});

  useEffect(()=>{
    setTmpRange({min:String(props.integralRange.min),max:String(props.integralRange.max)})
  },[props.integralRange])

  return (
    <Grid container spacing={1} padding={1} display='flex' alignItems='center'>
      <Grid item xs={12}>
        <Stack direction="row" spacing={1}>
          <TextField
            label={'time min'}
            value={tmpRange.min}
            onChange={(e)=>{
              const newTmpRange = {...tmpRange,...{min:formatNumericText(e.target.value)}};
              setTmpRange(newTmpRange);
            }}
            onBlur={()=>props.setIntegralRange({min:Number(tmpRange.min),max:Number(tmpRange.max)})}
          />
          <TextField
            label={'time max'}
            value={tmpRange.max}
            onChange={(e)=>{
              const newTmpRange = {...tmpRange,...{max:formatNumericText(e.target.value)}};
              setTmpRange(newTmpRange);
            }}
            onBlur={()=>props.setIntegralRange({min:Number(tmpRange.min),max:Number(tmpRange.max)})}
          />
          <Button onClick={()=>props.handleCalcConcData()}>calc</Button>
        </Stack>
      </Grid>
    </Grid>
  )
}

export default IntegralInput;
