import { useCallback, useState } from "react";


const useIntegralRange=()=>{
  const [integralRange, setIntegralRange] = useState<{min:number,max:number}>({min:0,max:100});

  const handleIntegralRange=useCallback((range:{min:number, max:number})=>{
    const min = range.min < 0 ? 0 :range.min;
    const max = range.max <= range.min ? range.min+1 : range.max;
    setIntegralRange({min:min,max:max});
  },[])

  return [integralRange, handleIntegralRange] as const;
}

export default useIntegralRange;
