import { useCallback, useState } from 'react';
import { Node } from 'reactflow';
import formatNumericText from '../../formatNumericText';


type NodeDialogHook = {
  tmpNode: Node;
  handleClose: (v: string) => void;
  handleOnChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, k: string) => void;
  handleOnChangeNumber: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, k: string) => void;
  handleOnChangeBoolean: (k: string) => void;
};

const useNodeDialog = (initialNode: Node, onClose: (newNode?: Node) => void): NodeDialogHook => {
  const [tmpNode, setTmpNode] = useState<Node>(initialNode);

  const handleClose = useCallback((v: string) => {
    if (v === 'OK') {
      //Dialogで入力した値はstringなのでnumberに変換する
      const tmpNodeNumberData = Object.fromEntries( // 以下の処理で得られる配列をオブジェクト化
        Object.keys(tmpNode.data).filter((key)=>tmpNode.data[key].type===Number) // dataのタイプがreactionでないものを取得
        .map((key)=>[
          key,{
          value:tmpNode.data[key].value!=='--'?Number(tmpNode.data[key].value):'--', // dataのvalueが'--'のものは対象外
          type:tmpNode.data[key].type
        }]))
      const tmpNodeNewData = {data:{symbol:tmpNode.data.symbol,...tmpNodeNumberData}} // dataのタイプがreactionでないものはsymbolのみであることを期待
      const newNode = Object.assign({},tmpNode,tmpNodeNewData);
      onClose(newNode);
    } else if (v === 'Cancel') {
      onClose();
    }
  },[tmpNode,onClose]);

  const handleOnChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, k: string) => {
    const newTmpData = { ...tmpNode.data, [k]: {value:e.target.value, type:String} };
    const newTmpNode = { ...tmpNode, data: newTmpData };
    setTmpNode(newTmpNode);
  },[tmpNode]);

  const handleOnChangeNumber = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, k: string) => {
    const formatText = formatNumericText(e.target.value);
    const newTmpData = { ...tmpNode.data, [k]: {value:formatText,type:Number} };
    const newTmpNode = { ...tmpNode, data: newTmpData };
    setTmpNode(newTmpNode);

  },[tmpNode]);

  const handleOnChangeBoolean = useCallback((k: string) => {
    const newTmpData = { ...tmpNode.data, [k]: {value:!tmpNode.data[k]['value'],type:Boolean} };
    const newTmpNode = { ...tmpNode, data: newTmpData };
    setTmpNode(newTmpNode);
  },[tmpNode]);

  return { tmpNode, handleClose, handleOnChange, handleOnChangeNumber, handleOnChangeBoolean };
};

export default useNodeDialog;
