import { useEffect, useState } from "react";
import { Node } from "reactflow";

const useInitConc=(nodes:Node[])=>{
  const [initConc, setInitConc] = useState<{[key:string]:number}>({})

  useEffect(()=>{
    const materialNodes:Node[] = nodes.filter(node=>node.type!=="reaction")
    const newInitConc:{[key:string]:number} = Object.fromEntries(materialNodes.map(materialNode=>["Y["+materialNode.id.replace("m","")+"]",materialNode.data.initial_concentration.value]).sort());
    if(JSON.stringify(newInitConc)===JSON.stringify(initConc))return;
    setInitConc(newInitConc);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[nodes])

  return [initConc] as const;
}

export default useInitConc;
