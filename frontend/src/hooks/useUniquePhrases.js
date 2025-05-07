import { useState, useCallback, useRef } from 'react';

const useUniquePhrases = (phrasesList) => {
  const [usedPhrases, setUsedPhrases] = useState([]);
  const availablePhrasesRef = useRef([...phrasesList]);

  const getUniquePhrase = useCallback(() => {
    if (availablePhrasesRef.current.length === 0) {
      // Reset if we've used all phrases
      availablePhrasesRef.current = [...phrasesList];
      const phrase = availablePhrasesRef.current.shift();
      setUsedPhrases([phrase]);
      return phrase;
    }

    const randomIndex = Math.floor(Math.random() * availablePhrasesRef.current.length);
    const phrase = availablePhrasesRef.current[randomIndex];
    availablePhrasesRef.current.splice(randomIndex, 1);
    setUsedPhrases(prev => [...prev, phrase]);
    return phrase;
  }, [phrasesList]);

  const resetPhrases = useCallback(() => {
    availablePhrasesRef.current = [...phrasesList];
    setUsedPhrases([]);
  }, [phrasesList]);

  return { getUniquePhrase, resetPhrases };
};

export default useUniquePhrases;