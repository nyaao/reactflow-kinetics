import * as React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Grid, Paper, styled, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { myTheme } from '../../myTheme';

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body1,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    backgroundColor: theme.palette.primary.main,
    padding:theme.spacing(1),
  }));

type Props={
    name:string,
    expanded:boolean,
    nodetypes:string[],
    handleChange:(panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => void,
}

export function NodesAccPanel(props:Props){

  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return(
    <Accordion expanded={props.expanded} onChange={props.handleChange(props.name)}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1bh-content"
        id="panel1bh-header"
      >
      <Typography sx={{ width: '33%', flexShrink: 0 }}>
        Nodes
      </Typography>
      <Typography sx={{ color: 'text.secondary' }}>
      </Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Grid spacing={1} container display='flex' alignItems='center'>
          {props.nodetypes
          .filter((type:string)=>type!=='background')
          .map((type:string)=>(
            <Grid key={type} item xs={3}>
              <Item 
                key={type} 
                onDragStart={(event) => onDragStart(event, type)} 
                draggable
                style={type==="reaction" ? {backgroundColor: myTheme.palette.warning.light} : {backgroundColor: myTheme.palette.success.light}}
              >
                {type}
              </Item>
            </Grid>
          ))}
        </Grid>
      </AccordionDetails>
    </Accordion>
  )
}

