import axios from "axios";
import { useState } from "react";
import urls from "../private";

const useCalcConcData=()=>{
  const [calcConcData, setCalcConcData] = useState<{[key: string]: number}[]>([{id:0,time:0}]);

  const handleCalcConcData = async (
    keyTranslationSet:{[key:string]:string}|null,
    reactionRateExpression:{[key:string]:string}|null,
    initConc:{[key:string]:number},
    reactionRateConstant:{[key:string]:number},
    time:{min:number, max:number},
    expConcData:{[key:string]:number}[],
    selectedDataKeys:{[key:string]:boolean},
    optRanges: {id: string,opt: boolean,min: number,max: number}[],
    setReactionRateConstant:(obj:{[key:string]:number})=>void,
    handleOptRanges: (newranges:{id: string,opt: boolean,min: number,max: number}[]) => void,
    handleIsCalculating:(value:boolean)=>void,
  ) =>{
    if(keyTranslationSet===null || reactionRateExpression==null){return;}
    const swapTranslationSet = Object.fromEntries(Object.entries(keyTranslationSet).map(([key,value])=>[value,key]))
    console.log(swapTranslationSet)

    const modExpConcData = (expConcData.map((data)=>{
      return Object.fromEntries(Object.entries(data).map(([key,value])=>[Object.keys(swapTranslationSet).includes(key) ? swapTranslationSet[key] : key,value]))
    }))
    console.log(modExpConcData)

    const modSelectedDataKeys = Object.fromEntries(Object.entries(selectedDataKeys).map(([key,value])=>[Object.keys(swapTranslationSet).includes(key) ? swapTranslationSet[key] : key,value]))
    console.log(modSelectedDataKeys)

    const selectedOptParam = optRanges.filter((optrange)=>optrange.opt===true)[0]
    console.log(selectedOptParam)

    handleIsCalculating(true);

    axios.post(urls.parseEquation,
      {body:{scheme:reactionRateExpression,
        init_y:initConc,params:reactionRateConstant,
        time:time,
        expData:modExpConcData,
        selectedData:modSelectedDataKeys,
        optParam:selectedOptParam===undefined ? {} : {id:selectedOptParam.id, min:selectedOptParam.min, max:selectedOptParam.max}
      }}).then(async(res)=>{
        const data = typeof(res.data)==='object' ? res.data : JSON.parse(res.data) //lambdaの場合は文字列で返してくる
        console.log(data)
        const calcResults = data[0]
        const symbolKey = Object.keys(initConc).map((key)=>keyTranslationSet[key]+'c') // symbolの配列
        const calcConcs:number[][] = Object.values(calcResults).map((d)=>Array.isArray(d) ? d.slice(1) : new Array(calcResults.length-1).fill(0)) // 計算された濃度の配列、一次元目は時間に相当
        const symbolCalcConcObjArray:{[key:string]:number}[] = calcConcs.map(sublist=>
                                        Object.fromEntries(symbolKey.map((key,i)=>[key, Array.isArray(sublist) ? sublist[i] :0]))) // 一旦Symbolと濃度の配列をマージ
        const idTimeObjArray:{[key:string]:number}[] = Object.keys(calcResults).map((d,i)=>({id:i,time:Number(d)})) // idとtimeの配列

        const mergedData:{[key:string]:number}[] = idTimeObjArray.map((idtime,i)=>({...idtime, ...symbolCalcConcObjArray[i]})) //id time symbol concすべてをマージ
        console.log(mergedData);
        setCalcConcData(mergedData);

        const optParams = data[1].map((k:number,i:number)=>({['k['+i+']']:k})).filter((_:number,i:number)=>i!==0)
        const mergedOptParams = Object.assign({},...optParams)
        setReactionRateConstant(mergedOptParams);

        if(!data[2]){
          handleIsCalculating(false);
          return;}
        ;
        
        const newOptRanges = optRanges.map(item =>
          item.id === data[2].id ? { ...item, ...data[2],opt:true } : item
        );
        handleOptRanges(newOptRanges);
        console.log(newOptRanges)

        handleIsCalculating(false);
      })
  }

  return [calcConcData, handleCalcConcData] as const;
}

export default useCalcConcData;
