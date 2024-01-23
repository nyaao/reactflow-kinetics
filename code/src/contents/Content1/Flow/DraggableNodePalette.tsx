import { Accordion, AccordionDetails, AccordionSummary, Grid, Typography } from '@mui/material';
import React, { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { MaterialNodeStyle, ReactionNodeStyle } from '../Styles/NodeStyles';

type DraggableNodePaletteProps = {
  onDragStart: (event: React.DragEvent<HTMLDivElement>, nodeType: string) => void
}

const DraggableNodePalette = (props:DraggableNodePaletteProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Accordion expanded={open} onChange={()=>setOpen(!open)}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
      >
      <Typography sx={{ width: '33%', flexShrink: 0 }}>
        Nodes
      </Typography>
      <Typography sx={{ color: 'text.secondary' }}>
        {''}
      </Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Grid spacing={1} container display='flex' alignItems='center'>
            <Grid item xs={12}>
              <ReactionNodeStyle draggable onDragStart={(e)=>props.onDragStart(e,'reaction')}>反応</ReactionNodeStyle>
            </Grid>
            <Grid item xs={12}>
              <MaterialNodeStyle draggable onDragStart={(e)=>props.onDragStart(e,'reactant')}>反応剤</MaterialNodeStyle>
            </Grid>
            <Grid item xs={12}>
              <MaterialNodeStyle draggable onDragStart={(e)=>props.onDragStart(e,'product')}>生成物</MaterialNodeStyle>
            </Grid>
            <Grid item xs={12}>
              <MaterialNodeStyle draggable onDragStart={(e)=>props.onDragStart(e,'intermediate')}>中間体</MaterialNodeStyle>
            </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default DraggableNodePalette
