import { ChangeEvent } from "react";
import ExcelJS, { CellValue } from 'exceljs';
import { Node,Edge } from "reactflow";
import React from "react";
import { getMaxFromArray } from "../utils";

export const ExportExcel=async(e:{ preventDefault: () => void; },NODES:Node[],EDGES:Edge[],SCHEMEDATA:{[key:string]:string}|null)=>{
  e.preventDefault()

  const workbook = new ExcelJS.Workbook();
  workbook.addWorksheet('node');
  workbook.addWorksheet('nodedata');
  workbook.addWorksheet('edge');
  workbook.addWorksheet('edgedata');
  workbook.addWorksheet('schemedata');
  const nodesheet = workbook.getWorksheet("node");
  const nodedatasheet = workbook.getWorksheet("nodedata");
  const edgesheet = workbook.getWorksheet("edge");
  const edgedatasheet = workbook.getWorksheet("edgedata");
  const schemedatasheet = workbook.getWorksheet("schemedata");

  nodesheet.columns = ["id","type","position"].map((v)=>(
    {header:v.toUpperCase(),key:v}
  ));
  nodesheet.addRows(
    NODES.map(n=>(
      {
        id:n.id,
        type:n.type,
        position:n.position,
      }
    ))
  );
  nodedatasheet.columns = [
    {header:"ID",key:"id"},
    ...Object.keys(NODES[0].data).map((k)=>(
      {"header":k.toUpperCase(),"key":k}
    ))
  ];
  nodedatasheet.addRows(
    NODES.map(n=>(
      Object.assign({},
        {id:n.id},
        ...Object.keys(n.data).map((k:any)=>(
          {[k]:n.data[k]}
        ))
      )
    ))
  );

  edgesheet.columns = ["id","type","label","source","sourceHandle","target","targetHandle","animated","markerEnd"].map(
    (v)=>(
      {header:v.toUpperCase(),key:v}
  ));
  edgesheet.addRows(
    EDGES.map(e=>(
      {
        id:e.id,
        type:e.type,
        label:e.label,
        source:e.source,
        sourceHandle:e.sourceHandle,
        target:e.target,
        targetHandle:e.targetHandle,
        animated:e.animated,
        markerEnd:e.markerEnd,
      }
    ))
  );

  edgedatasheet.columns = [
    {header:"ID",key:"id"},
    ...Object.keys(EDGES[0].data).map((k)=>(
      {"header":k.toUpperCase(),"key":k}
    ))
  ];
  edgedatasheet.addRows(
    EDGES.map(e=>(
      Object.assign({},
        {id:e.id},
        ...Object.keys(e.data).map((k:any)=>(
          {[k]:e.data[k]}
        ))
      )
    ))
  );

  schemedatasheet.columns = [{"header":"INTEGRAND", "key":"integrand"},{"header":"SCHEME","key":"scheme"}];
  if(SCHEMEDATA!==null){
    schemedatasheet.addRows(
      Object.keys(SCHEMEDATA).map((integ)=>(
        {integrand:integ,scheme:SCHEMEDATA[integ]}                
      ))
    );
  }

  const uint8Array = await workbook.xlsx.writeBuffer();
  const blob = new Blob([uint8Array], { type: "application/octet-binary" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "sampleData.xlsx";
  a.click();
  a.remove();
}

export const LoadExcelData=async(data: ExcelJS.Buffer)=>{
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(data);

  // //Nodeデータの読込
  // const nodesheet = workbook.getWorksheet('node');
  // const nodetags = nodesheet.getRow(1).values as CellValue[];
  // const nodeinfo = Object.assign({},
  // ...nodetags.map((tag,i)=>(
  //   {[String(tag)]:nodesheet.getColumn(i).values.map((data)=>(data)).slice(2)}
  // )))
  // const nodedatasheet = workbook.getWorksheet('nodedata');                          //sheet読込
  // const nodedatatags = nodedatasheet.getRow(1).values as CellValue[];               //1行目をタグとして読み込む
  // const nodedatainfo = Object.assign({},                                            // 以下２行で生成した連想配列を纏める
  // ...nodedatatags.map((tag,i)=>(                                                    // タグ毎にデータを取得
  //   {[String(tag)]:nodedatasheet.getColumn(i).values.map((data)=>(data)).slice(2)}  //タグをキーとして、各列のデータを配列として取得
  // )))
  // const newnodes:Node[] = new Array(nodeinfo.ID.length).fill(nodeinfo.ID.length).map((_,i)=>(
  //   {
  //     id:nodeinfo.ID[i],
  //     type:nodeinfo.TYPE[i],
  //     position:JSON.parse(nodeinfo.POSITION[i]),
  //     data:Object.assign({},
  //       ...Object.keys(nodedatainfo).map((k)=>(
  //         k==="ID" ? {} : {[k.toLowerCase()]:nodedatainfo[k][i]}
  //       ))
  //     )
  //   }
  // ));

  // //Edgeデータの読込
  // const edgesheet = workbook.getWorksheet('edge');
  // const edgetags = edgesheet.getRow(1).values as CellValue[];
  // const edgeinfo = Object.assign({},
  // ...edgetags.map((tag,i)=>(
  //   {[String(tag)]:edgesheet.getColumn(i).values.map((data)=>(data)).slice(2)}
  // ))
  // );
  // const edgedatasheet = workbook.getWorksheet('edgedata');
  // const edgedatatags = edgedatasheet.getRow(1).values as CellValue[];
  // const edgedatainfo = Object.assign({},
  // ...edgedatatags.map((tag,i)=>(
  //   {[String(tag)]:edgedatasheet.getColumn(i).values.map((data)=>(data)).slice(2)}
  // ))
  // )
  // const newedges:Edge[] = new Array(edgeinfo.ID.length).fill(edgeinfo.ID.length).map((_,i)=>(
  //   {
  //     id:edgeinfo.ID[i],
  //     type:edgeinfo.TYPE[i],
  //     label:edgeinfo.LABEL[i],
  //     source:edgeinfo.SOURCE[i],
  //     sourceHandle:edgeinfo.SOURCEHANDLE[i],
  //     target:edgeinfo.TARGET[i],
  //     targetHandle:edgeinfo.TARGETHANDLE[i],
  //     animated:Boolean(edgeinfo.ANIMATED[i]),
  //     markerEnd:JSON.parse(edgeinfo.MARKEREND[i]),
  //     data:Object.assign({},
  //       ...Object.keys(edgedatainfo).map((k)=>(
  //         k==="ID" ? {} : {[k.toLowerCase()]:edgedatainfo[k][i]}
  //       ))
  //     )
  //   }
  // ))

  // //Schemeデータの読込
  // const schemesheet = workbook.getWorksheet('schemedata');
  // const schemetags = schemesheet.getRow(1).values as CellValue[];
  // const schemeinfo = Object.assign({},
  // ...schemetags.map((tag,i)=>(
  //   {[String(tag)]:schemesheet.getColumn(i).values.map((data)=>(data)).slice(2)}
  // ))
  // );

  // return {newnodes:newnodes,newedges:newedges}
  return 
}

export const ImportExpDataExcel=(
  EVENT:ChangeEvent<HTMLInputElement>,
  // SETNODES:(value: React.SetStateAction<Node<any>[]>) => void,
  // SETEDGES:(value: React.SetStateAction<Edge<any>[]>) => void,
  // HANDLE:(nodes:Node[],edges:Edge[])=> Promise<void>
  )=>{
  if(EVENT.target.files!==null){
    const blobURL = window.URL.createObjectURL(EVENT.target.files[0]);
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      const result = xhr.response;
      const data = new Uint8Array(result);
      LoadExcelData(data).then((res)=>{
        console.log(res);
        // const nodeRIdArray = res["newnodes"].filter(n=>n.type==='reaction').map((node)=>Number(node.id.replace("r","")));
        // setRId(getMaxFromArray(nodeRIdArray)+1);
        // const nodeMIdArray = res["newnodes"].filter(n=>n.type!=='reaction').map((node)=>Number(node.id.replace("m","")));
        // setMId(getMaxFromArray(nodeMIdArray)+1);
        // SETNODES(res["newnodes"]);
        // SETEDGES(res["newedges"]);
        // HANDLE(res["newnodes"],res["newedges"]);
        });
      };
    xhr.responseType = "arraybuffer";
    xhr.open("GET", blobURL);
    xhr.send();
  }
}

