import { Handle, Position,NodeProps } from 'reactflow';
import { MaterialNodeStyle, ReactionNodeStyle } from '../../Styles/NodeStyles';

export const ReactionNode=({
  data,
}:NodeProps)=>{

  return (
    <ReactionNodeStyle>
      {data.symbol.value}
      <Handle type="source" position={Position.Right}/>
      <Handle type="target" position={Position.Left}/>
    </ReactionNodeStyle>
  );
}

export const MaterialNode=({
  type,
  data,
}:NodeProps)=>{

  return (
    <MaterialNodeStyle>
      {data.symbol.value}
      {(type==='reactant' || type==='intermediate') && <Handle type="source" position={Position.Right}/>}
      {(type==='product'  || type==='intermediate') && <Handle type="target" position={Position.Left}/>}
    </MaterialNodeStyle>
  );
}
