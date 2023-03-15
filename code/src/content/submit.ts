import axios from 'axios';
import { createDefaultNodeParams } from './default';
import { Node, Edge } from 'reactflow';

export const calc=async(nodes:Node[],edges:Edge[])=>{
    // const res = await axios.post('https://*****.****.****/',{body:{nodes:nodes,edges:edges}})
    const res = await axios.post('http://127.0.0.1:8000/apitest/',{body:{nodes:nodes,edges:edges}})
    const retnodes:Node[] = JSON.parse(res.data.nodes);
    const newnodes = nodes.map((n,i)=>(Object.assign({},
      createDefaultNodeParams(n.type as string, n.position),
      {data:Object.assign({},n.data,retnodes.filter(rn=>rn.id===n.id)[0]["data"])}
    )));
    return {newnodes:newnodes}
    
  }

  export const calc2=async(REREADIMGDATA:{[key:string]:string},SCHEMEDATA:{[key:string]:string})=>{
    // const res = await axios.post('https://*****.****.****/',{body:{nodes:nodes,edges:edges}})
    const res = await axios.post('http://127.0.0.1:8000/parseDifferentialEq/',{body:{rereading:REREADIMGDATA,scheme:SCHEMEDATA}})
    // const retnodes:Node[] = JSON.parse(res.data.nodes);
    // const newnodes = nodes.map((n,i)=>(Object.assign({},
    //   createDefaultNodeParams(n.type as string, n.position),
    //   {data:Object.assign({},n.data,retnodes.filter(rn=>rn.id===n.id)[0]["data"])}
    // )));
    // return {newnodes:newnodes}
    
  }  