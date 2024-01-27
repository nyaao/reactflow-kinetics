import { useState } from "react";

const useAppState=()=>{
  const [selectedMenu,setSelectedMenu] = useState<'Flow'|'Graph'|'Table'>('Flow');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return [selectedMenu, isDrawerOpen, isCalculating, {setSelectedMenu, handleDrawerToggle, setIsCalculating}] as const;
}

export default useAppState;
