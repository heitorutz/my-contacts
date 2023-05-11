import { useEffect, useRef, useState } from 'react';

export default function useAnimatedUnmout(visible) {
  const [shouldRender, setShouldRender] = useState(visible);
  const animatedElementRef = useRef(null);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
    }

    const handleAnimationEnd = () => {
      setShouldRender(false);
    };

    const elementRef = animatedElementRef.current;

    if (!visible && elementRef) {
      elementRef.addEventListener('animationend', handleAnimationEnd);
    }

    return () => {
      if (elementRef) {
        elementRef.removeEventListener('animationend', handleAnimationEnd);
      }
    };
  }, [visible]);

  return {
    shouldRender,
    animatedElementRef,
  };
}
