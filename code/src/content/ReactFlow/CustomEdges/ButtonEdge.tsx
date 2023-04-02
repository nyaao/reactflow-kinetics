import React from 'react';
import { getBezierPath,EdgeProps } from 'reactflow';
import { Button } from '@mui/material';

// import './index.css';

const foreignObjectSize = 40;

type argEdge = {
  id: number,
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  sourcePosition: 'left' | 'top' | 'right' | 'bottom',
  targetPosition: 'left' | 'top' | 'right' | 'bottom',
  style:{},
  markerEnd:any,
}

const onEdgeClick = (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: any) => {
  evt.stopPropagation();
  alert(`remove ${id}`);
};

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}:EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <foreignObject
        width={foreignObjectSize}
        height={foreignObjectSize}
        x={labelX - foreignObjectSize / 2}
        y={labelY - foreignObjectSize / 2}>
      <Button onClick={(event) => onEdgeClick(event, id)}>test</Button>
      </foreignObject>

    </>
  );
}
