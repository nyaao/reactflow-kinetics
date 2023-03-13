import { Accordion, AccordionSummary, Typography, AccordionDetails, Box, FormGroup, FormControlLabel, Checkbox, Button } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as React from "react";
import { Edge } from "reactflow";

type Props={
    name:string
    expanded:boolean,
    handleChange:(panel: string) => (event: React.SyntheticEvent, isExpanded: boolean)=>void,
    Edges:Edge[]
    setEdges:(Edges:Edge[])=>void
}

export function EdgeDiaplayAccPanel(props:Props){
  return(
    <Accordion expanded={props.expanded} onChange={props.handleChange(props.name)}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel2bh-content"
        id="panel2bh-header"
      >
        <Typography sx={{ width: '33%', flexShrink: 0 }}>
          Edge Display
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>
        </Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Box sx={{ display: 'flex' }}>
          <FormGroup>
            {props.Edges.length>0 &&
              Object.keys(props.Edges[0].data).map((key)=>(
                  <FormControlLabel
                    key={key}
                    label={key}
                    control={
                      <Checkbox
                        key={key}
                        id={key}
                        checked={props.Edges[0].data[key]===props.Edges[0].label}
                        onChange={()=>{
                          const newedges = props.Edges.map((edge,i)=>(
                            Object.assign({},
                              edge,
                              {label:edge.label===edge.data[key] ? edge.id : edge.data[key]}
                            )
                          ))
                          props.setEdges(newedges);
                        }
                        }
                      />}
                  />
            ))}
          </FormGroup>
        </Box>
      </AccordionDetails>
    </Accordion>
  )
}
