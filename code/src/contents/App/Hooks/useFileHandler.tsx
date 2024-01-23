import * as XLSX from 'xlsx';
import { Node, Edge } from 'reactflow';

const useFileHandler=(
  setNodes:(nodes:Node[])=>void,
  setEdges:(edges:Edge[])=>void,
  setExpConcData:(data:{[key: string]: number;}[])=>void,
  setSelectedDatakeys:(data:{[key:string]:boolean})=>void,
  setIntegralRange:(data:{min:number,max:number})=>void
)=>{

  const handleSaveExcel=(
    nodes:Node[],
    edges:Edge[],
    expConcData:{[key: string]: number;}[],
    calcConcData:{[key: string]: number;}[],
    selectedDataKeys:{[key:string]:boolean},
    integralRange:{min: number,max: number},
  )=>{
    const workbook = XLSX.utils.book_new();

    const saveObjectNodes = nodes.map((node:Node)=>{
      const keys= Object.keys(node) as (keyof Node)[];
      const transformedObject = Object.fromEntries(
        keys.map((key) =>
          [
            key,
            typeof node[key] === 'object' ?
            JSON.stringify(node[key],(key,value)=>{
              if(key==='type'){
                return typeof value === 'function' ? value.name : value;
              }
              return value
            })
            :
            node[key]
          ]
        )
      );
      return transformedObject;
    })
    const wsNodes = XLSX.utils.json_to_sheet(saveObjectNodes);
    XLSX.utils.book_append_sheet(workbook, wsNodes, 'nodes');

    const saveObjectEdges = edges.map((edge:Edge)=>{
      const keys= Object.keys(edge) as (keyof Edge)[];
      const transformedObject = Object.fromEntries(
        keys.map((key) => [key, typeof edge[key] === 'object' ? JSON.stringify(edge[key]) : edge[key]])
      );
      return transformedObject;
    })
    const wsEdges = XLSX.utils.json_to_sheet(saveObjectEdges);
    XLSX.utils.book_append_sheet(workbook, wsEdges, 'edges');

    const wsExpConc = XLSX.utils.json_to_sheet(expConcData);
    XLSX.utils.book_append_sheet(workbook, wsExpConc, 'expdata');

    const wsCalcConc = XLSX.utils.json_to_sheet(calcConcData);
    XLSX.utils.book_append_sheet(workbook, wsCalcConc, 'calcdata');

    const wsSelectedDataKeys = XLSX.utils.json_to_sheet([selectedDataKeys]);
    XLSX.utils.book_append_sheet(workbook, wsSelectedDataKeys, 'selecteddatakeys');

    const wsIntegralRange = XLSX.utils.json_to_sheet([integralRange]);
    XLSX.utils.book_append_sheet(workbook, wsIntegralRange, 'integralrange');

    XLSX.writeFile(workbook, "test.xlsx");
  }

  const handleLoadExcel=(files:FileList|null)=>{
    if(files){
      const reader = new FileReader();
      reader.onload=(e)=>{
        if (e && e.target && e.target.result) {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: 'binary' });

          const readNodes=()=>{
            const convertToType=(type:string)=>{
              switch (type) {
                  case "String":
                      return String;
                  case "Number":
                      return Number;
                  case "Boolean":
                      return Boolean;
                  default:
                      return type; // 未知の型の場合はそのまま残す
              }
            }
            // load Nodes
            const sheetNodes = workbook.Sheets["nodes"];
            const jsonDataNodes = XLSX.utils.sheet_to_json(sheetNodes);
            const loadObjectNodes = jsonDataNodes.map((node:Node)=>{
              const keys= Object.keys(node) as (keyof Node)[];
              const transformedObject = Object.fromEntries(
                keys.map((key) =>
                  [
                    key,
                    (key === 'data') || (key === 'position') || (key === 'positionAbsolute') ?
                    JSON.parse(node[key],(key,value)=>{
                      if(key==='type'){
                        return convertToType(value)
                      }
                      return value
                    })
                    :
                    node[key]
                  ]
                )
              );
              return transformedObject;
            })
            setNodes(loadObjectNodes);
          }

          const readEdges=()=>{
            // load Edges
            const sheetEdges = workbook.Sheets["edges"];
            const jsonDataEdges = XLSX.utils.sheet_to_json(sheetEdges);

            const loadObjectEdges = jsonDataEdges.map((edge:Edge)=>{
              const keys= Object.keys(edge) as (keyof Edge)[];
              const transformedObject = Object.fromEntries(
                keys.map((key) =>
                  [
                    key,
                    (key === 'data') || (key === 'markerEnd') ?
                    JSON.parse(edge[key])
                    :
                    edge[key]
                  ]
                )
              );
              return transformedObject;
            })
            setEdges(loadObjectEdges);
          }

          const readExpConcData=()=>{
            // load expConcData
            const sheetExpData = workbook.Sheets["expdata"];
            const jsonDataExpData = XLSX.utils.sheet_to_json(sheetExpData);
            setExpConcData(jsonDataExpData);
          }

          const readSelectedDataKeys=()=>{
            // load selectedDatakeys
            const sheetSelectedDataKeys = workbook.Sheets["selecteddatakeys"];
            const jsonDataSelectedDataKeys= XLSX.utils.sheet_to_json(sheetSelectedDataKeys);
            setSelectedDatakeys(jsonDataSelectedDataKeys[0]);
          }

          const readIntegralRange=()=>{
            // load integralRange
            const sheetIntegralRange = workbook.Sheets["integralrange"];
            const jsonDataIntegralRange = XLSX.utils.sheet_to_json(sheetIntegralRange);
            setIntegralRange(jsonDataIntegralRange[0]);
          }

          readNodes();
          readEdges();
          readExpConcData();
          readSelectedDataKeys();
          readIntegralRange();
        }
      }
      reader.readAsBinaryString(files[0])
    }
  }

  return {handleSaveExcel, handleLoadExcel}
}

export default useFileHandler;
