import { useEffect, useState } from "react";

export function useFirstVisit(key = "hasSeenChatTutorial") {
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(key);
    if (!seen) {
      setIsFirstVisit(true);
      localStorage.setItem(key, "true");
    }
  }, [key]);

  return isFirstVisit;
}
