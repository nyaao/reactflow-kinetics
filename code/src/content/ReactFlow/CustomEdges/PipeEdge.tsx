import React from 'react';
import { getSmoothStepPath,EdgeProps} from 'reactflow';


const style_selected = {strokeWidth:3,stroke:"#FF3333",}
const style_notselected = {strokeWidth:3,stroke:"#AAAA77",}

export function PipeEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
  label,
  selected,
  data,
}:EdgeProps) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
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
        style={selected===true? style_selected : style_notselected}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <text>
        <textPath
          href={`#${id}`}
          style={{ fontSize: '12px'}}
          startOffset="50%"
          textAnchor='middle'
        >
          {label}
        </textPath>
      </text>

    </>
  );
}
