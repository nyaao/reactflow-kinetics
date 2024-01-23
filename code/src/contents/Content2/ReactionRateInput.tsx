import { Grid, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import formatNumericText from '../functions/formatNumericText'
import DoubleLabelSwitch from "./DoubleLableSwitch";

type Props={
  reactionRateConstant:{[key: string]: number}
  setReactionRateConstant:(reactionRateConstant:{[key: string]: number})=>void;
}

export const ReactionRateInput=(props:Props)=>{
  const [tmpReactionRateConst, setTmpReactionRateConst] = useState<{[k: string]: string}>(Object.fromEntries(Object.entries(props.reactionRateConstant).map(([key,value])=>[key,String(value)])));

  useEffect(()=>{
    const newReactionRateConst = Object.fromEntries(Object.entries(props.reactionRateConstant).map(([key,value])=>[key,String(value)]));
    setTmpReactionRateConst(newReactionRateConst);
  },[props.reactionRateConstant])

  const [state, setState] = useState(false);

  return(
    <Grid container spacing={1} padding={1} display='flex' alignItems='center'>
      {Object.entries(tmpReactionRateConst).map(([key,value])=>{
        return <Grid item xs={12} key={key}>
                <Stack direction="row" spacing={1}>
                  <TextField
                    label={key}
                    value={value}
                    onChange={(e)=>{
                      const newTmpReactionRateConst = Object.fromEntries(Object.entries(tmpReactionRateConst).map(([k,value])=>[k,k===key ? formatNumericText(e.target.value) : String(value)]));
                      setTmpReactionRateConst(newTmpReactionRateConst);
                    }}
                    onBlur={()=>{
                      const newReactionRateConst = Object.fromEntries(Object.entries(tmpReactionRateConst).map(([key,value])=>[key,Number(value)]));
                      console.log(newReactionRateConst);
                      props.setReactionRateConstant(newReactionRateConst);
                    }}
                    disabled={state}
                  />
                  <DoubleLabelSwitch offLabel="manual" onLabel="auto" state={state} setState={setState}/>
                </Stack>
              </Grid>
      })}


      {/* <Grid item xs={12}>
        <Stack direction="row" spacing={1}>
          <TextField
            label={'key'}
            value={reactionRateConst}
            onChange={(e)=>setReactionRateConst(formatNumericText(e.target.value))}
            onBlur={()=>setReactionRateConst(Number(reactionRateConst))}
            disabled={state}
          />
          {state &&
            <>
              <TextField
                label={'min'}
                value={reactionRateConst}
                onChange={(e)=>setReactionRateConst(formatNumericText(e.target.value))}
                onBlur={()=>setReactionRateConst(Number(reactionRateConst))}
              />
              <TextField
                label={'max'}
                value={reactionRateConst}
                onChange={(e)=>setReactionRateConst(formatNumericText(e.target.value))}
                onBlur={()=>setReactionRateConst(Number(reactionRateConst))}
              />
            </>
          }
          <DoubleLabelSwitch offLabel="manual" onLabel="auto" state={state} setState={setState} disabled={true}/>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" spacing={1}>
          <TextField
            label={'key'}
            value={reactionRateConst}
            onChange={(e)=>setReactionRateConst(formatNumericText(e.target.value))}
            onBlur={()=>setReactionRateConst(Number(reactionRateConst))}
            disabled={state}
          />
          {state &&
            <>
              <TextField
                label={'min'}
                value={reactionRateConst}
                onChange={(e)=>setReactionRateConst(formatNumericText(e.target.value))}
                onBlur={()=>setReactionRateConst(Number(reactionRateConst))}
              />
              <TextField
                label={'max'}
                value={reactionRateConst}
                onChange={(e)=>setReactionRateConst(formatNumericText(e.target.value))}
                onBlur={()=>setReactionRateConst(Number(reactionRateConst))}
              />
            </>
          }
          <DoubleLabelSwitch offLabel="manual" onLabel="auto" state={state} setState={setState} disabled={true}/>
        </Stack>
      </Grid> */}
    </Grid>
  )
}
