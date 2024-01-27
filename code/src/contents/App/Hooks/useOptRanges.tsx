import { useEffect, useState } from "react";
import { Node } from "reactflow";

const useOptRange=(nodes:Node[])=>{
  const [optRanges, setOptRanges] = useState<{id:string, opt:boolean, min:number, max:number}[]>([]);

  useEffect(()=>{
    console.log("Before optRanges Update", optRanges);
    const reaction_nodes = nodes.filter(node=>node.type==='reaction')
    console.log(reaction_nodes);
    const newOptRange = (reaction_nodes.map((node)=>(
      optRanges.filter(optrange=>optrange.id===node.id)[0]===undefined ? // reaction_nodeのidはr1,r2など、optrangeのidはk[1],k[2]など、なので常に初期化される状態になってしまっている
      {
        // id:'k['+node.id.replace('r','')+']',
        id:node.id,
        opt:false,
        min:0,
        max:1,
      }
      :
      {
        id:node.id,
        opt:optRanges.filter(optrange=>optrange.id===node.id)[0]['opt'],
        min:optRanges.filter(optrange=>optrange.id===node.id)[0]['min'],
        max:optRanges.filter(optrange=>optrange.id===node.id)[0]['max'],
      }
    )))
    if(JSON.stringify(newOptRange)===JSON.stringify(optRanges))return;
    console.log("Before optRanges Update", optRanges);
    console.log("After", newOptRange);
    setOptRanges(newOptRange);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[nodes])

  const handleOptRanges=(newranges:{id:string, opt:boolean, min:number, max:number}[])=>{
    const valid = (newranges.map((newrange)=>{
      if(newrange.min>=newrange.max)return false;
      return true;
    }))
    if(valid.includes(false))return;
    setOptRanges(newranges);
  }
  return [optRanges, handleOptRanges] as const;
}

export default useOptRange;
