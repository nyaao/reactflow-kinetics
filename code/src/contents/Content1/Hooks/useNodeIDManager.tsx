import { useCallback } from 'react';

const useNodeIDManager=()=>{

  const getNextID=useCallback((ids:string[])=>{
    // idsの各要素（ID）は一文字目が文字、それ以降は数字が格納されているものとする
    // IDの番号は１から始まる

    // 一文字目の文字（接頭辞）を除去して、数値部分を昇順にする
    const sanitizedIDs = ids.map(id=>Number(id.slice(1))).sort((a, b) => a - b);
    // 空いているIDを探す
    const emptyIndex = sanitizedIDs.findIndex((id, index) => id !== index+1);
    // 空きIDがある場合は、空きID、ない場合は最後尾のIDを追加
    const finalID = emptyIndex !== -1 ? emptyIndex : sanitizedIDs.length

    return String(finalID+1)
  },[])

  return getNextID;
}

export default useNodeIDManager;
