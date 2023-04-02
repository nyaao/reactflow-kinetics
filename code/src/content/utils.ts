import { styled, Switch } from "@mui/material";
import { useState, useEffect, useLayoutEffect, } from "react";
import { Connection, Edge,Node } from "reactflow";
import { createDefaultEdgeParams, createDefaultNodeParams} from "./default";


// 配列から最大値、最小値を取得する関数。この書き方の方が安全らしい・・・
export const getMaxFromArray=(arr:number[])=>{
  const getMax=(a: number,b: number)=>{return Math.max(a,b)};
  return arr.reduce(getMax);
}

export const getMinFromArray=(arr:number[])=>{
  const getMin=(a: number,b: number)=>{return Math.min(a,b)};
  return arr.reduce(getMin);
}

// blobURLからbase64に変換するカスタムフック。フック廻りはもっと勉強する必要あり
const convertDataUrl2Blob=async (dataUrl:any)=>{
  return await (await fetch(dataUrl)).blob()
}

export const useURL2Base64=(URL:any)=>{
  const [base64, setBase64] = useState<string>();

  useEffect(()=>{
    convertDataUrl2Blob(URL).then((blob)=>{
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload=(e)=>{
        setBase64(e.target?.result as string)
      }
  })
  },[URL])

  return {base64}
}

// windowの高さを取得するカスタムフック、他にも良い書き方があるかも
export const useWindowSize = (): number[] => {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    const updateSize = (): void => {
      setSize([window.innerWidth, window.innerHeight]);
    };

    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
};

// pythonのzip関数に相当
export const zip=(array1:number[], array2:number[])=>{
  if(array1.length!==array2.length){
    return;
  }
  const retarray = array1.map((v,i)=>([v,array2[i]]));
  return retarray;
}

export const getNewEdgeParams=(EDGES:Edge<any>[],PARAMS: Edge<any> | Connection)=>{
    const sourcehandle = PARAMS.sourceHandle ? PARAMS.sourceHandle : "";
    const targethandle = PARAMS.targetHandle ? PARAMS.targetHandle : "";

    // if(EDGES.length>0){
      // 最初に作成するエッジではない場合は、labelにどの値が入っているか検出して、labelに対応する値を格納する必要がある
      // const labelkey =  Object.keys(EDGES[0].data).filter((key)=>(EDGES[0].label===EDGES[0].data[key]))[0];
      // const tmpedgeparams = createDefaultEdgeParams(PARAMS.source,sourcehandle,PARAMS.target,targethandle);
      // const tmp = {label:labelkey===undefined ? tmpedgeparams.id : tmpedgeparams.data[labelkey]};
      // const newedgeparams = Object.assign({},tmpedgeparams,tmp);
      // return newedgeparams;
    // }else{
      // 最初に作成するエッジの場合にdefault.tsで定義されているデフォルト値がlabelに格納される
      const newedgeparams = createDefaultEdgeParams(
        PARAMS.source===null?"":PARAMS.source,
        sourcehandle,
        PARAMS.target===null?"":PARAMS.target,
        targethandle);
      return newedgeparams;
    // }
}

export const getNewNode=(
  EVENT:{preventDefault:()=>void; dataTransfer:{getData:(arg0:string)=>any;}; clientX:number; clientY: number;},
  REACTFLOWWRAPPER:React.MutableRefObject<HTMLDivElement | null>,
  REACTFLOWINSTANCE:any,
  NODES:Node<any>[],
  )=>{

  if(REACTFLOWWRAPPER.current!==null && REACTFLOWINSTANCE!==null){
    const reactFlowBounds = REACTFLOWWRAPPER.current.getBoundingClientRect();
    const type = EVENT.dataTransfer.getData('application/reactflow');

    // check if the dropped element is valid
    if (typeof type === 'undefined' || !type) {
      return;
    }

    const position = REACTFLOWINSTANCE.project({
      x: EVENT.clientX - reactFlowBounds.left,
      y: EVENT.clientY - reactFlowBounds.top,
    });

    if(NODES.length>0){
      // 最初に作成するノードではない場合は、labelにどの値が入っているか検出して、labelに対応する値を格納する必要がある
      const labelkey =  Object.keys(NODES[0].data)
        .filter((key)=>(key!=='label'))
        .filter((key)=>(NODES[0].data.label===NODES[0].data[key]))[0]
      const tmpnodeparams = createDefaultNodeParams(type,position);
      const tmp = Object.assign({},
        tmpnodeparams,
        {data:Object.assign({},
          tmpnodeparams.data,
          {label:labelkey===undefined ? tmpnodeparams.id : tmpnodeparams.data[labelkey]},
          // {symbol:"symbol_"+tmpnodeparams.id}
          )
        }
        )
      const newnode:Node<any> = Object.assign({},tmpnodeparams,tmp)
      return newnode;
    }else{
      // 最初に作成するノードの場合はdefault.tsで定義されているデフォルト値がlabelに格納される
      const newnode:Node<any> = createDefaultNodeParams(type,position);
      return newnode;
    }
  }
}

export const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 15,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(9px)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(12px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#1890ff',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(['width'], {
      duration: 200,
    }),
  },
  '& .MuiSwitch-track': {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
    boxSizing: 'border-box',
  },
}));

// 速度定数（ｋ）の下付きNoを取得
// NodesをReactionNodeをID昇順でソートした後に、No割当て
// export const getKineticConstantNo=(nodes:Node[],node:Node)=>{
//   const reactionNodes = nodes.filter(n=>n.type==="reaction")
//   const sortedReactionNodes = [...reactionNodes].sort(function(a,b){return Number(a.id)-Number(b.id)})
//   const kineticConstantList = sortedReactionNodes.map((rn,i)=>({"id":rn.id,"kineticConstantNo":i}))
//   return kineticConstantList.filter(n=>n.id===node.id)[0].kineticConstantNo;
// }

// 被積分変数（Y)の下付きNoを取得
// ReactionNode以外のNodeをID昇順でソートした後に、No割当て
// export const getIntegrandNo=(nodes:Node[],node:Node)=>{
//   const integrandNodes = nodes.filter(n=>n.type!=="reaction")
//   const sortedIntegrandNodes = [...integrandNodes].sort(function(a,b){return Number(a.id)-Number(b.id)})
//   const integrandValiableList = sortedIntegrandNodes.map((rn,i)=>({"id":rn.id,"IntegrandVariableNo":i}))
//   return integrandValiableList.filter(n=>n.id===node.id)[0].IntegrandVariableNo;
// }

export const convertFromNumberToAlpha = (num: number): string | null => {
  let temp,
    letter = '';
  while (num > 0) {
    temp = (num - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    num = (num - temp - 1) / 26;
  }
  return letter;
};
