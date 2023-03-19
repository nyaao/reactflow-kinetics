import { MarkerType } from "reactflow";
import { ReactantNode } from "./CustomNodes/ReactantNode";
import { ReactionNode } from "./CustomNodes/ReactionNode";
import { ProductNode } from "./CustomNodes/ProductNode";
import { InterMediateNode } from "./CustomNodes/InterMediateNode";
import { BackGroundNode } from "./CustomNodes/BackGroundNode";

// other
// export const setId=(newid:number)=>{
//   id=newid
// }
// let id = 1;
// const getId = () => `${id++}`;

let rid=1
const getRId = () => `${rid++}`;
export const setRId=(newid:number)=>{
  rid=newid
}

let mid=1
const getMId = () => `${mid++}`;
export const setMId=(newid:number)=>{
  mid=newid
}

// Node
export const NodeTypes = {
  // カスタムノードがあればここに記載する
  reaction: ReactionNode,
  reactant: ReactantNode,
  product:ProductNode,
  intermediate:InterMediateNode
  //background: BackGroundNode
};
export interface nodeDataTypes{
  [key:string]:number|string|boolean
}
const nodeDataDefault:nodeDataTypes ={
  //用途に応じてデフォルト値を決定
  "symbol":"",
  "initialConcentration":0.0,
  "kineticConstant":0.0,
}

export const createBackgroundNodeParams=(src:string|undefined)=>{
  return {
    id: "0",
    type: 'background',
    position: {x:0,y:0},
    data:Object.assign({},{label:"0"},{src:src},nodeDataDefault),
    draggable:false,
    selectable:false,
    // zIndex:1,
  }
};


export const createDefaultNodeParams=(type:string,position:any)=>{
  const id = type === 'reaction' ? "r"+String(getRId()) : "m"+String(getMId());
  return {
    id: id,
    type: type,
    position: position,
    data: type==='reaction' 
      ? Object.assign({},{label:id},{src:""},nodeDataDefault,{kineticConstant:0.05},{initialConcentration:"-"})
      : (type==='reactant' 
        ? Object.assign({},{label:id},{src:""},nodeDataDefault,{kineticConstant:"-"},{initialConcentration:0.1})
        : Object.assign({},{label:id},{src:""},nodeDataDefault,{kineticConstant:"-"},{initialConcentration:0.0})
      ),
    zIndex:100,
  }
};

// Edge
export const EdgeTypes= {
  // カスタムエッジがあればここに記載する
};
export interface edgeDataTypes{
  [key:string]:number|string
}
export const edgeDataDefault:edgeDataTypes ={
  //用途に応じてデフォルト値を決定
  "property1":987,
  "property2":"abc"
}
export const createDefaultEdgeParams=(source:string|null,sourcehandle:string,target:string|null,targethandle:string)=>{
  return {
    id: 'e'+source+sourcehandle+'-'+target+targethandle,
    source: source,
    target: target,
    animated: false,
    markerEnd: {type: MarkerType.Arrow,} ,
    type: '',
    sourceHandle:sourcehandle,
    targetHandle:targethandle,
    label:'e'+source+sourcehandle+'-'+target+targethandle,
    zIndex:100,
    data:Object.assign({},edgeDataDefault)
  }
};

