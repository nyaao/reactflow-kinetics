// useNodeDialog.ts
import { useCallback, useState } from 'react';
import { Edge } from 'reactflow';
import formatNumericText from '../../formatNumericText';


type EdgeDialogHook = {
  tmpEdge: Edge;
  handleClose: (v: string) => void;
  handleOnChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, k: string) => void;
  handleOnChangeNumber: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, k: string) => void;
  handleOnChangeBoolean: (k: string) => void;
};

const useEdgeDialog = (initialEdge: Edge, onClose: (newEdge?: Edge) => void): EdgeDialogHook => {
  const [tmpEdge, setTmpEdge] = useState<Edge>(initialEdge);

  const handleClose = useCallback((v: string) => {
    if (v === 'OK') {
      const newEdge = { ...tmpEdge };
      onClose(newEdge);
    } else if (v === 'Cancel') {
      onClose();
    }
  },[tmpEdge,onClose]);

  const handleOnChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, k: string) => {
    const newTmpData = { ...tmpEdge.data, [k]: {value:e.target.value, type:String} };
    const newtmpEdge = { ...tmpEdge, data: newTmpData };
    setTmpEdge(newtmpEdge);
  },[tmpEdge]);

  const handleOnChangeNumber = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, k: string) => {
    const formatText = formatNumericText(e.target.value);
    const newTmpData = { ...tmpEdge.data, [k]: {value:formatText,type:Number} };
    const newtmpEdge = { ...tmpEdge, data: newTmpData };
    setTmpEdge(newtmpEdge);

  },[tmpEdge]);

  const handleOnChangeBoolean = useCallback((k: string) => {
    const newTmpData = { ...tmpEdge.data, [k]: {value:!tmpEdge.data[k]['value'],type:Boolean} };
    const newtmpEdge = { ...tmpEdge, data: newTmpData };
    setTmpEdge(newtmpEdge);
  },[tmpEdge]);

  return { tmpEdge, handleClose, handleOnChange, handleOnChangeNumber, handleOnChangeBoolean };
};

export default useEdgeDialog;
