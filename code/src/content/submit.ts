import axios from 'axios';
import { createDefaultEdgeParams, createDefaultNodeParams } from './default';
import { Node, Edge } from 'reactflow';

export const calc=async(nodes:Node[],edges:Edge[])=>{
    const res = await axios.post('https://qpl98gtxdi.execute-api.ap-northeast-1.amazonaws.com/dev/api/kinetics_equation/',{body:{nodes:nodes,edges:edges}})
    // axios.post('http://127.0.0.1:8000/apitest/',{Nodes:nodes,Edges:edges})

    const retnodes:Node[] = JSON.parse(res.data.nodes);
    const newnodes = nodes.map((n,i)=>(Object.assign({},
      createDefaultNodeParams(n.type as string, n.position),
      {data:Object.assign({},n.data,retnodes.filter(rn=>rn.id===n.id)[0]["data"])}
    )));
    return {newnodes:newnodes}
    
  }