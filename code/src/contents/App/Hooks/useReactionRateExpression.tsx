import axios from "axios";
import { useEffect, useState } from "react";
import urls from "../private";
import { Node,Edge } from "reactflow";
import isEqualObjects from "../../isEqualObjects";

const createKeyTranslationSet=(nodes:Node[])=>{
  const keyTranslationSet_material = Object.assign({},...nodes
    .filter((nn)=>nn.type!=='reaction')
    .map((nn)=>(
    {["Y["+nn.id.replace("m","")+"]"]:"["+nn.data.symbol.value+"]"}
  )));

  const keyTranslationSet_reaction = Object.assign({},...nodes
    .filter((nn)=>nn.type==='reaction')
    .map((nn)=>(
    {["k["+nn.id.replace("r","")+"]"]:"k_"+nn.id.replace("r","")}
  )));

  const keyTranslationSet = {...keyTranslationSet_material,...keyTranslationSet_reaction};
  return keyTranslationSet;
}

const createReactionRateExpression=(nodes:Node[])=>{
  const reactionRateExpression = Object.assign({},...nodes
    .filter((nn)=>nn.type!=='reaction')
    .map((nn)=>(
    {["Y["+nn.id.replace("m","")+"]"]:nn.data.equation} // APIから帰ってきたnodeにしかnn.data.equationは存在しない
  )));
  return reactionRateExpression;
}

const useReactionRateExpressions=(nodes:Node[],edges:Edge[])=>{
  const [keyTranslationSet, setKeyTranslationSet] = useState<{[key:string]:string}|null>(null)
  const [reactionRateExpression, setReactionRateExpression] = useState<{[key:string]:string}|null>(null)

  useEffect(()=>{
    if(edges.length===0) return;

    const newKeyTranslationSet = createKeyTranslationSet(nodes);

    // APIから帰ってきたnodeにしかnn.data.equationは存在しない。下行のnewReactionRateExpressionは常に{}になる
    // const newReactionRateExpression = createReactionRateExpression(nodes);
    // そのため無限ループ抑制のためには使用できない
    if(isEqualObjects(keyTranslationSet,newKeyTranslationSet)) return;

    axios.post(urls.createEquation,{body:{nodes:nodes,edges:edges}})
    .then((res)=>{
      console.log(nodes);
      const retnodes:Node[] = JSON.parse(res.data.nodes);
      const newKeyTranslationSet = createKeyTranslationSet(retnodes);
      const newReactionRateExpression = createReactionRateExpression(retnodes);
      setKeyTranslationSet(newKeyTranslationSet);
      setReactionRateExpression(newReactionRateExpression);
    })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[edges, nodes])

  return [keyTranslationSet,reactionRateExpression] as const;
}

export default useReactionRateExpressions;
