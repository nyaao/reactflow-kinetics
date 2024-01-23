import { useEffect, useState } from "react"
import _ from 'lodash';

const useSelectedDataKeys=(data:{[key: string]: number;}[])=>{
  const [selectedData, setSelectedData] = useState<{[key:string]:boolean}>({})

  useEffect(()=>{
    const newSelectedDataKey = Object.keys(data[0]).filter(key => key !== 'id' && key !== 'time');
    const newSelectedData = Object.fromEntries(newSelectedDataKey.map(key => [key, selectedData[key] !== undefined ? selectedData[key] : true]));
    if(_.isEqual(newSelectedData,selectedData)){return;}
    setSelectedData(newSelectedData);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[data]);

  return [selectedData, setSelectedData] as const;
}

export default useSelectedDataKeys;
