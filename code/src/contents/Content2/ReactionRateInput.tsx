import { Grid, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import DoubleLabelSwitch from "./DoubleLableSwitch";
import formatNumericText from "../formatNumericText";

// このファイルの整理が必要、tmpOptRanges -> stringOptRangesに名称変更, idではなくsymbolにすべき

type Props={
  reactionRateConstant:{[key: string]: number}
  setReactionRateConstant:(reactionRateConstant:{[key: string]: number})=>void;
  optRanges: {id:string, opt:boolean, min:number, max:number}[]
  handleOptRanges: (newrange: {id: string,opt: boolean,min: number,max: number}[]) => void;
}

type typeTmpOptRanges={id:string,opt:boolean,min:string,max:string}

export const ReactionRateInput=(props:Props)=>{
  const initialTmpReactionRateConst:{[k: string]: string} = Object.fromEntries(Object.entries(props.reactionRateConstant).map(([key,value])=>[key,String(value)]))
  const initialTmpOptRanges: typeTmpOptRanges[] = props.optRanges.map((optrange) => ({
    id: optrange.id,
    opt: optrange.opt,
    min: String(optrange.min),
    max: String(optrange.max),
  }));
  const [tmpReactionRateConst, setTmpReactionRateConst] = useState<{[k: string]: string}>(initialTmpReactionRateConst);
  const [tmpOptRanges, setTmpOptRanges] = useState<typeTmpOptRanges[]>(initialTmpOptRanges)

  useEffect(()=>{
    const newReactionRateConst = Object.fromEntries(Object.entries(props.reactionRateConstant).map(([key,value])=>[key,String(value)]));
    setTmpReactionRateConst(newReactionRateConst);
  },[props.reactionRateConstant])

  useEffect(()=>{
    const newOptRanges = props.optRanges.map((optrange) => ({
      id: optrange.id,
      opt: optrange.opt,
      min: String(optrange.min),
      max: String(optrange.max),
    }));
    setTmpOptRanges(newOptRanges);
  },[props.optRanges])

  console.log("optRanges",props.optRanges)
  console.log("reactionRateConstant",props.reactionRateConstant)

  return(
    <Grid container spacing={1} padding={1} display='flex' alignItems='center'>
      {Object.entries(tmpReactionRateConst).map(([key,value])=>{
        const optRangeKey = 'r'+key.replace('k[','').replace(']','')
        console.log(optRangeKey)
        console.log(tmpOptRanges.map((tmpoptrange)=>tmpoptrange.id))
        console.log(tmpOptRanges.filter(tmpoptrange=>tmpoptrange.id===optRangeKey)[0].opt)
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
                      props.setReactionRateConstant(newReactionRateConst);
                    }}
                    disabled={tmpOptRanges.filter(tmpoptrange=>tmpoptrange.id===optRangeKey)[0].opt}
                  />
                  {tmpOptRanges.filter(tmpoptrange=>tmpoptrange.id===optRangeKey)[0].opt &&
                    <>
                      <TextField
                        label={'min'}
                        value={tmpOptRanges.filter(tmpoptrange=>tmpoptrange.id===optRangeKey)[0].min}
                        onChange={(e)=>{
                          const newTmpRange = {
                            id: tmpOptRanges.filter(tmpoptrange=>tmpoptrange.id===optRangeKey)[0].id,
                            opt: tmpOptRanges.filter(tmpoptrange=>tmpoptrange.id===optRangeKey)[0].opt,
                            min: formatNumericText(e.target.value),
                            max: tmpOptRanges.filter(tmpoptrange=>tmpoptrange.id===optRangeKey)[0].max,
                          };
                          setTmpOptRanges([...tmpOptRanges.filter(optrange=>optrange.id!==optRangeKey),newTmpRange])
                        }}
                        onBlur={()=>{
                          const newOptRanges = tmpOptRanges.map((optrange) => ({
                            id: optrange.id,
                            opt: optrange.opt,
                            min: Number(optrange.min),
                            max: Number(optrange.max),
                          }));
                          props.handleOptRanges(newOptRanges);
                        }}
                      />
                      <TextField
                        label={'max'}
                        value={tmpOptRanges.filter(tmpoptrange=>tmpoptrange.id===optRangeKey)[0].max}
                        onChange={(e)=>{
                          const newTmpRange = {
                            id: tmpOptRanges.filter(tmpoptrange=>tmpoptrange.id===optRangeKey)[0].id,
                            opt: tmpOptRanges.filter(tmpoptrange=>tmpoptrange.id===optRangeKey)[0].opt,
                            min: tmpOptRanges.filter(tmpoptrange=>tmpoptrange.id===optRangeKey)[0].min,
                            max: formatNumericText(e.target.value),
                          };
                          setTmpOptRanges([...tmpOptRanges.filter(optrange=>optrange.id!==optRangeKey),newTmpRange])
                        }}
                        onBlur={()=>{
                          const newOptRanges = tmpOptRanges.map((optrange) => ({
                            id: optrange.id,
                            opt: optrange.opt,
                            min: Number(optrange.min),
                            max: Number(optrange.max),
                          }));
                          props.handleOptRanges(newOptRanges);
                        }}
                      />
                    </>
                    }
                  <DoubleLabelSwitch
                    offLabel="manual"
                    onLabel="auto"
                    state={tmpOptRanges.filter(tmpoptrange=>tmpoptrange.id===optRangeKey)[0].opt}
                    onChange={(checked)=>{
                      const newTmpRange = {
                        id: tmpOptRanges.filter(tmpoptrange=>tmpoptrange.id===optRangeKey)[0].id,
                        opt: checked,
                        min: tmpOptRanges.filter(tmpoptrange=>tmpoptrange.id===optRangeKey)[0].min,
                        max: tmpOptRanges.filter(tmpoptrange=>tmpoptrange.id===optRangeKey)[0].max,
                      };
                      const newTmpRanges = tmpOptRanges.map((tmpoptrange)=>({
                        id: tmpoptrange.id,
                        opt: false,
                        min: tmpoptrange.min,
                        max: tmpoptrange.max,
                      }))
                      setTmpOptRanges([...newTmpRanges.filter(optrange=>optrange.id!==optRangeKey),newTmpRange])

                      const newOptRanges = props.optRanges.map((optrange)=>({
                        id: optrange.id,
                        opt: false,
                        min: optrange.min,
                        max: optrange.max,
                      }))
                      const newOptRange = {
                        id: props.optRanges.filter(optrange=>optrange.id===optRangeKey)[0].id,
                        opt: checked,
                        min: Number(props.optRanges.filter(optrange=>optrange.id===optRangeKey)[0].min),
                        max: Number(props.optRanges.filter(optrange=>optrange.id===optRangeKey)[0].max),
                      }
                      props.handleOptRanges([...newOptRanges.filter(optrange=>optrange.id!==optRangeKey),newOptRange]);
                    }}
                  />
                </Stack>
              </Grid>
      })}
    </Grid>
  )
}
