import { useRef } from 'react';

export function useAnimatedList(list: any, itemWidth: number) {
    const animationDuration: number = 300;
    const initialScrollOffsetRef = useRef<number>(0);
    const finalScrollOffsetRef = useRef<number>(0);
    const isAnimationEnabled = useRef<boolean>(false);
    const requestAnimationFrameID = useRef<number>(0);

    const _animate = (startTime: number) => {
        const scrollDelta = finalScrollOffsetRef.current - initialScrollOffsetRef.current;
        if (typeof requestAnimationFrame === 'undefined' || !isAnimationEnabled.current) {
            list?.scrollToItem(finalScrollOffsetRef.current / itemWidth);
            initialScrollOffsetRef.current = finalScrollOffsetRef.current;
            return;
        }

        requestAnimationFrameID.current = requestAnimationFrame(() => {
            const elapsed = performance.now() - startTime;
            const easedTime = Math.min(1, elapsed / animationDuration);
            const scrollOffset = initialScrollOffsetRef.current + scrollDelta * easedTime;
            list?.scrollToItem(scrollOffset / itemWidth);
            if (elapsed < animationDuration) {
                _animate(startTime);
            } else {
                initialScrollOffsetRef.current = finalScrollOffsetRef.current;
            }
        });
    };

    const scrollToItem = (index: number, hasAnimation: boolean) => {
        if (typeof index === 'undefined') return;

        finalScrollOffsetRef.current = index * itemWidth;
        isAnimationEnabled.current = hasAnimation;
        _animate(performance.now());
    };

    return { scrollToItem };
}
