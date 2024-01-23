import { useState } from "react";

const useAppState=()=>{
  const [selectedMenu,setSelectedMenu] = useState<'Flow'|'Graph'|'Table'>('Flow');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return [selectedMenu, isDrawerOpen, {setSelectedMenu, handleDrawerToggle}] as const;
}

export default useAppState;
