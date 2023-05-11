import {
  useCallback, useRef, useState, createRef, useEffect,
} from 'react';

export default function useAnimatedList(initialValue = []) {
  const [items, setItems] = useState(initialValue);
  const [pendingRemovalItemsIds, setPedingingRemovalItemsIds] = useState([]);

  const animatedRefs = useRef(new Map());
  const animationEndListeners = useRef(new Map());

  const handleAnimationEnd = useCallback((itemId) => {
    const removeListener = animationEndListeners.current.get(itemId);
    removeListener();

    animationEndListeners.current.delete(itemId);
    animatedRefs.current.delete(itemId);

    setItems((prevState) => prevState.filter((item) => item.id !== itemId));
    setPedingingRemovalItemsIds((prevState) => prevState.filter((id) => id !== itemId));
  }, []);

  useEffect(() => {
    pendingRemovalItemsIds.forEach((itemID) => {
      const animatedRef = animatedRefs.current.get(itemID);
      const animatedElement = animatedRef?.current;
      const alreadyHasListener = animationEndListeners.current.has(itemID);

      if (animatedElement && !alreadyHasListener) {
        const onAnimationEnd = () => handleAnimationEnd(itemID);

        const removeListener = () => {
          animatedElement.removeEventListener('animationend', onAnimationEnd);
        };

        animatedElement.addEventListener('animationend', onAnimationEnd);
        animationEndListeners.current.set(itemID, removeListener);
      }
    });
  }, [pendingRemovalItemsIds, handleAnimationEnd]);

  useEffect(() => {
    const removeListeners = animationEndListeners.current;

    return () => {
      removeListeners.forEach((removeListener) => removeListener());
    };
  }, []);

  const handleRemoveItem = useCallback((id) => {
    setPedingingRemovalItemsIds((prevState) => [...prevState, id]);
  }, []);

  const getAnimatedRef = useCallback((itemId) => {
    let animatedRef = animatedRefs.current.get(itemId);

    if (!animatedRef) {
      animatedRef = createRef();
      animatedRefs.current.set(itemId, animatedRef);
    }

    return animatedRef;
  }, []);

  const renderList = useCallback((renderItem) => (
    items.map((item) => {
      const isLeaving = pendingRemovalItemsIds.includes(item.id);

      const animatedRef = getAnimatedRef(item.id);

      return renderItem(item, { isLeaving, animatedRef });
    })
  ), [items, pendingRemovalItemsIds, getAnimatedRef]);

  return {
    items,
    renderList,
    setItems,
    handleRemoveItem,

  };
}
