import { useEffect, useState } from "react";
import { Node } from "reactflow";
import _ from 'lodash';

type UseDataProps={
  nodes:Node[],
  setNodes:(nodes:Node[])=>void
}

const useExpConcData=({nodes,setNodes}:UseDataProps)=>{
  const [data, setData] = useState<{[key:string]:number}[]>([{'id':0,'time':0}]);

  useEffect(()=>{
    const initialConcentrations:{[key:string]:number} = Object.fromEntries(
      nodes.filter((node)=>node.type!=='reaction') // 'reactionノードを対象外とする'
      .map((node)=>['['+node.data.symbol.value+']',node.data.initial_concentration.value] //dataの構造に合わせたオブジェクト {[A]:0.1,...}
    ));
    const initialCondition = {'id':0,'time':0,...initialConcentrations}; // idとtimeを追加、いずれも0で固定

    const newConcentrationKey:string = Object.keys(initialCondition).filter((key)=>!Object.keys(data[0]).includes(key))[0]; // 新たに追加されたノードのキー
    const newConcentrationValue:number = initialConcentrations[newConcentrationKey]; // 新たに追加されたノードのキーに対する値
    const newConcentration:{[key:string]:number} = newConcentrationKey===undefined ? {} : {[newConcentrationKey]:newConcentrationValue}; // 新たに追加されたノードの初期濃度
    const dataNewConcentraionAdded:{[key:string]:number}[] =  data.map(d=>({...d,...newConcentration})); // dataの全てに追加された初期濃度を反映する
    const newdata = [initialCondition,...dataNewConcentraionAdded.slice(1)]; // 最初の要素にinitialConditionを挿入 nodediaolgで初期濃度を更新した時の対応

    // console.log(newdata);

    if (_.isEqual(newdata,data))return; // dataとnewdataに違いがない場合は更新しない
    setData(newdata);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[nodes])

  useEffect(()=>{
    // dataが更新された時にnodesに反映する
    const initData = data[0];
    const filteredData = Object.fromEntries(
      Object.entries(initData).filter(([key]) => key !== 'id' && key !== 'time') // キーがid,timeである要素を除去
    );

    if(nodes.length===0){return;}

    const updateNodes = nodes.map((node)=>{
      const symbol = '['+node.data.symbol.value+']';
      const newValue = filteredData[symbol];
      if(newValue===undefined){return node};
      return {
        ...node,
        data:{
          ...node.data,
          initial_concentration:{value:newValue,type:Number}
        }
      }
    })

    // console.log(updateNodes)

    if (_.isEqual(updateNodes, nodes)) return; // nodesとupdateNodesに違いがない場合は更新しない
    setNodes(updateNodes);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[data])

  return [data, setData] as const;
}

export default useExpConcData;
