import axios from 'axios';
import { createDefaultNodeParams } from './default';
import { Node, Edge } from 'reactflow';

export const calc=async(nodes:Node[],edges:Edge[])=>{
    // const res = await axios.post('',{body:{nodes:nodes,edges:edges}}) //lambda
    const res = await axios.post('http://127.0.0.1:8001/apitest/',{body:{nodes:nodes,edges:edges}})
    const retnodes:Node[] = JSON.parse(res.data.nodes);
    console.log(retnodes);
    const newnodes = nodes.map((n,i)=>(Object.assign({},
      {id:n.id,
      type:n.type,
      position:n.position,
      zIndex:100},
      {data:Object.assign({},n.data,retnodes.filter(rn=>rn.id===n.id)[0]["data"])}
    )));
    return {newnodes:newnodes}
    
  }

  export const calc2=async(SCHEMEDATA:{[key:string]:string},INITY:{[key:string]:number},PARAMS:{[key:string]:number},time:{min:number,max:number})=>{
    // const res = await axios.post('',{body:{scheme:SCHEMEDATA,init_y:INITY,params:PARAMS,time}}) //lambda
    const res = await axios.post('http://127.0.0.1:8001/parseDifferentialEq/',{body:{scheme:SCHEMEDATA,init_y:INITY,params:PARAMS,time:time}})
    // const retnodes:Node[] = JSON.parse(res.data.nodes);
    // const newnodes = nodes.map((n,i)=>(Object.assign({},
    //   createDefaultNodeParams(n.type as string, n.position),
    //   {data:Object.assign({},n.data,retnodes.filter(rn=>rn.id===n.id)[0]["data"])}
    // )));
    return res
    
  }  
