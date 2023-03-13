import { Accordion, AccordionSummary, Typography, AccordionDetails, Box, FormGroup, FormControlLabel, Checkbox} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as React from "react";
import { Node } from "reactflow";

type Props={
    name:string
    expanded:boolean,
    handleChange:(panel: string) => (event: React.SyntheticEvent, isExpanded: boolean)=>void,
    Nodes:Node[]
    setNodes:(Nodes:Node[])=>void
}

export function NodeDiaplayAccPanel(props:Props){
  return(
    <Accordion expanded={props.expanded} onChange={props.handleChange(props.name)}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel2bh-content"
        id="panel2bh-header"
      >
        <Typography sx={{ width: '33%', flexShrink: 0, }}>
          Node Display
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>
        </Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Box sx={{ display: 'flex' }}>
          <FormGroup>
            {props.Nodes.length>0 &&
              Object.keys(props.Nodes[0].data)
              .filter((key)=>(key!=='label'))
              .filter((key)=>(key!=='src'))
              .map((key)=>(
                  <FormControlLabel
                    key={key}
                    label={key}
                    control={
                      <Checkbox
                        key={key}
                        id={key}
                        checked={props.Nodes[0].data[key]===props.Nodes[0].data.label}
                        onChange={()=>{
                          const newedges = props.Nodes.map((node,i)=>(
                            Object.assign({},
                              node,
                              {data:Object.assign({},
                                node.data,
                                {label:node.data.label===node.data[key] ? node.id : node.data[key]}
                              )}
                            )
                          ))
                          props.setNodes(newedges);
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
