import { useEffect, useState } from "react";
import { Node } from "reactflow";
import isEqualObjects from "../../isEqualObjects";
import isEqualObjectArrays from "../../isEqualObjectArrays";

const useReactionRateConstant=(nodes:Node[],setNodes:(nodes:Node[])=>void)=>{
  const [reactionRateConstant, setReactionRateConstant] = useState<{[key:string]:number}>({})

  useEffect(()=>{
    const reactionNodes:Node[] = nodes.filter(node=>node.type==="reaction")
    const newReactionRateConstant:{[key:string]:number} = Object.fromEntries(reactionNodes.map(reactionNode=>["k["+reactionNode.id.replace("r","")+"]",reactionNode.data.kinetic_constant.value]));
    // {'[k1]:0.1,...'}

    if(isEqualObjects(newReactionRateConstant,reactionRateConstant))return;
    setReactionRateConstant(newReactionRateConstant);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[nodes])

  useEffect(()=>{
    const updateNodes = nodes.map((node)=>{
      if(node.type!=='reaction'){return node};
      const key = "k["+node.id.replace("r","")+"]";
      const newValue = reactionRateConstant[key];

      return {
        ...node,
        data:{
          ...node.data,
          kinetic_constant:{value:newValue,type:Number}
        }
      }
    })
    if(isEqualObjectArrays(updateNodes,nodes))return;
    setNodes(updateNodes);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[reactionRateConstant])

  return [reactionRateConstant, setReactionRateConstant] as const;
}

export default useReactionRateConstant;
