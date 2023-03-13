import * as React from 'react';
import { Node,Edge } from 'reactflow';
// import { AccPanel } from './AccordionPanels/AccPanel';
import { NodesAccPanel } from './AccordionPanels/NodesAccPanel';
import { EdgeDiaplayAccPanel } from './AccordionPanels/EdgeDisplayAccPanel';
import { NodeDiaplayAccPanel } from './AccordionPanels/NodeDisplayAccPanel';
import { myTheme } from '../myTheme';

interface Panels{
  [panelNum:string]:boolean
}

type Props={
  NodeTypeKeys:string[],
  Nodes:Node[]
  Edges:Edge[],
  setNodes:(Nodes:Node[])=>void,
  setEdges:(Edges:Edge[])=>void,
}

const panelObj:{[key:string]:string} = {
  // カスタムしたアコーディオンパネルのcaseで判断させる値はここで記載
  'panel1':"nodepanel",
  'panel2':"nodedisplay",
  'panel3':"edgedisplay",
}

export default function SideBarMain(props:Props) {
  const [expanded, setExpanded] = React.useState<Panels>(
    Object.assign({},
    ...Object.keys((panelObj)).map((p)=>(
      {[p]:false}
    )))
  );

  const handleChange = React.useCallback((panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      const newpanel = Object.assign({},
        ...Object.keys(panelObj).map((k)=>({
          [k]:panel===k ? (expanded[k] ? false : true):expanded[k],
        })))
      setExpanded(newpanel);
    },[expanded]);

  return (
    <div style={{backgroundColor:myTheme.palette.primary.main,height:"100%"}}>
      {Object.keys(panelObj).map((k:string)=>{
        switch(panelObj[k]){
          // カスタムしたアコーディオンパネルを使用する場合はここに記載、caseで表示判断させる→22行目参照
        case 'nodepanel':
          return <NodesAccPanel
                  key={k}
                  name={k}
                  expanded={expanded[k]}
                  handleChange={handleChange}
                  nodetypes={props.NodeTypeKeys}
                />
        case 'nodedisplay':
          return <NodeDiaplayAccPanel
                  key={k}
                  name={k}
                  expanded={expanded[k]}
                  handleChange={handleChange}
                  Nodes={props.Nodes}
                  setNodes={props.setNodes}
                />
        case 'edgedisplay':
          return <EdgeDiaplayAccPanel
                  key={k}
                  name={k}
                  expanded={expanded[k]}
                  handleChange={handleChange}
                  Edges={props.Edges}
                  setEdges={props.setEdges}
                />
        }
        })
      }
    </div>
  );
}
