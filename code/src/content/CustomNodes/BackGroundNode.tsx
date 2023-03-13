import { Paper, styled } from '@mui/material';
import { NodeProps } from 'reactflow';
import * as React from 'react';

const Item = styled('div')(({theme})=>({
  width:theme.spacing(100),
  height:theme.spacing(100),
  color:theme.palette.primary.main,
  zIndex:-100,
}))

export function BackGroundNode({
  data
}:NodeProps){
  
  return (
    <Item>
      <img src={data.src} alt=""/>
    </Item>
  );
}
