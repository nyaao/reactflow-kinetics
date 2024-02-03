import { useCallback } from "react";
import { Edge, Connection, addEdge, MarkerType } from "reactflow";

type UseOnConnectProps = {
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
};

const createCustomEdgeParams=(params: Edge<any> | Connection)=>{
    const source = params.source ? params.source : "";
    const sourcehandle = params.sourceHandle ? params.sourceHandle : "";
    const target = params.target ? params.target : "";
    const targethandle = params.targetHandle ? params.targetHandle : "";

    if(source[0]===target[0]) return;

    const newedge:Edge = {
      id: 'e'+source+sourcehandle+'-'+target+targethandle,
      source: source,
      target: target,
      animated: false,
      markerEnd: {type: MarkerType.Arrow,} ,
      type: '',
      sourceHandle:sourcehandle,
      targetHandle:targethandle,
      // label:'e'+source+sourcehandle+'-'+target+targethandle,
      label:'',
      zIndex:100,
      data:{}
    }

    return newedge;
}

const useOnConnect=({setEdges}:UseOnConnectProps)=>{
  const onConnect = useCallback(
    (params: Edge | Connection) => {
      const newedgeparams = createCustomEdgeParams(params);
      newedgeparams && setEdges((eds) => addEdge(newedgeparams, eds));
    }, [setEdges]);

  return [{onConnect}] as const;
}

export default useOnConnect;
