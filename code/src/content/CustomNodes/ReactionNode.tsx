import { Handle, Position,NodeProps } from 'reactflow';
import * as React from 'react';
import { styled, Paper } from '@mui/material'
import { myTheme } from '../myTheme';

const Item = styled(Paper)(({theme})=>({
  width:myTheme.spacing(8),
  height:myTheme.spacing(4),
  lineHeight: theme.spacing(4),
  textAlign:"center",
  backgroundColor:myTheme.palette.warning.light
}))


export function ReactionNode({
  selected,
  data,
}:NodeProps) {

  return (
    <Item>
      {data.label}
      <Handle type="source" position={Position.Right}/>
      <Handle type="target" position={Position.Left}/>
    </Item>
  );
}
