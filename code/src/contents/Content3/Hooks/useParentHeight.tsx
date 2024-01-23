import { useEffect, useState } from "react";

// 引数のIDであるコンポーネントの高さを取得するカスタムフック
// 親コンポーネントの高さを取得して、サイズ調整する際に使用する
const useParentHeight = (elementId: string): number => {
  const [parentHeight, setParentHeight] = useState<number>(400); // 初期の高さを設定

  useEffect(() => {
    const updateParentHeight = () => {
      const parentElement = document.getElementById(elementId);
      if (parentElement) {
        const height = parentElement.clientHeight;
        setParentHeight(height);
      }
    };

    // 初回の計算とリサイズ時の更新
    updateParentHeight();
    window.addEventListener('resize', updateParentHeight);

    // クリーンアップ関数
    return () => {
      window.removeEventListener('resize', updateParentHeight);
    };
  }, [elementId]);

  return parentHeight;
};

export default useParentHeight;
