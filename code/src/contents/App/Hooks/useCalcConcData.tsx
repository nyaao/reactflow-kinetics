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
    selectedDataKeys:{[key:string]:boolean}
  ) =>{
    if(keyTranslationSet===null || reactionRateExpression==null){return;}
    const res = await axios.post(urls.parseEquation,{body:{scheme:reactionRateExpression,init_y:initConc,params:reactionRateConstant,time:time,expData:expConcData,selectedData:selectedDataKeys}})
    const data = typeof(res.data)==='object' ? res.data : JSON.parse(res.data) //lambdaの場合は文字列で返してくる

    const symbolKey = Object.keys(initConc).map((key)=>keyTranslationSet[key]+'c') // symbolの配列
    const calcConcs:number[][] = Object.values(data).map((d)=>Array.isArray(d) ? d.slice(1) : new Array(data.length-1).fill(0)) // 計算された濃度の配列、一次元目は時間に相当
    const symbolCalcConcObjArray:{[key:string]:number}[] = calcConcs.map(sublist=>
                                    Object.fromEntries(symbolKey.map((key,i)=>[key, Array.isArray(sublist) ? sublist[i] :0]))) // 一旦Symbolと濃度の配列をマージ
    const idTimeObjArray:{[key:string]:number}[] = Object.keys(data).map((d,i)=>({id:i,time:Number(d)})) // idとtimeの配列

    const mergedData:{[key:string]:number}[] = idTimeObjArray.map((idtime,i)=>({...idtime, ...symbolCalcConcObjArray[i]})) //id time symbol concすべてをマージ
    console.log(mergedData);
    setCalcConcData(mergedData);
  }

  return [calcConcData, handleCalcConcData] as const;
}

export default useCalcConcData;
