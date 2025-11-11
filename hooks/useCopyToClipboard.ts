
import { useState, useCallback, useEffect } from 'react';

export const useCopyToClipboard = (timeout = 2000): [boolean, (text: string) => void] => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback((text: string) => {
    if (typeof text !== 'string' || text.length === 0) {
      return;
    }
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
    });
  }, []);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, timeout);
      return () => clearTimeout(timer);
    }
  }, [isCopied, timeout]);

  return [isCopied, handleCopy];
};
