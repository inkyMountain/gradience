import React, {
  TouchEventHandler,
  useCallback,
  useEffect,
  useMemo,
  // useMemo,
  useRef,
  useState,
} from 'react';
import classes from '../utils/classes';
import './index.scss';
import measureScrollBarWidth from '../utils/measureScrollBarWidth';

interface ScrollBarProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  viewHeight: number;
  scrollBarClass?: string;
}

const ScrollBar: React.FunctionComponent<ScrollBarProps> = (props) => {
  const {children, scrollBarClass, viewHeight} = props;
  const [barHeight, setBarHeight] = useState(0);

  const scrollRef = useRef<HTMLDivElement>() as { current: HTMLDivElement };
  const barRef = useRef<HTMLDivElement>() as { current: HTMLDivElement };

  // show scroll bar only when needed
  const [scrollElementRight, setScrollElementRight] = useState(0);
  const [shouldSimulateScrollBar, setShouldSimulateScrollBar] = useState(false);
  useEffect(() => {
    const _shouldSimulateScrollBar =
      scrollRef.current.clientHeight !== scrollRef.current.scrollHeight;
    setShouldSimulateScrollBar(_shouldSimulateScrollBar);
    if (_shouldSimulateScrollBar) {
      setScrollElementRight(-measureScrollBarWidth());
    }
  }, [scrollRef]);

  // calculate scroll bar height
  useEffect(() => {
    const scrollHeight = scrollRef.current.scrollHeight;
    setBarHeight((viewHeight / scrollHeight) * viewHeight);
  }, [scrollRef]);

  // barHeight / viewHeight = scrollTop / scrollHeight = scrollPercent
  const [barOffset, setBarOffset] = useState(0);

  // change scroll bar offset when dragging with mouse
  const isDraggingBar = useRef<boolean>(false);
  const primaryClientY = useRef(0);
  const primaryOffset = useRef(0);

  const onBarMouseDown = useCallback(
    (event: React.MouseEvent) => {
      isDraggingBar.current = true;
      primaryClientY.current = event.clientY;
      primaryOffset.current = barOffset;
    },
    [isDraggingBar, barOffset]
  );

  useEffect(() => {
    const mouseMoveListener = (event: MouseEvent) => {
      if (!isDraggingBar.current) return;
      const delta = event.clientY - primaryClientY.current;
      const scrollHeight = scrollRef.current.scrollHeight;
      const maxBarOffset = (1 - viewHeight / scrollHeight) * viewHeight;
      // max & min 用来防止滚动条超出上下限
      const newOffset = Math.max(Math.min(delta + primaryOffset.current, maxBarOffset), 0);
      scrollRef.current.scrollTop =
        (newOffset / viewHeight) * scrollRef.current.scrollHeight;
      setBarOffset(newOffset);
    };
    document.addEventListener('mousemove', mouseMoveListener);
    return () => {
      document.removeEventListener('mousemove', mouseMoveListener);
    };
  }, []);

  useEffect(() => {
    const mouseUpListener = () => {
      isDraggingBar.current = false;
    };
    document.addEventListener('mouseup', mouseUpListener);
    return () => {
      document.removeEventListener('mouseup', mouseUpListener);
    };
  }, []);

  // prevent unexpected selection when moving scroll bar with mouse.
  useListener('selectstart', barRef, (event: Event) => {
    // clear original user selection
    window?.getSelection()?.empty();
    // prevent user selection when move scroll bar
    const shouldPreventDefault = event.currentTarget === barRef.current;
    shouldPreventDefault && event.preventDefault();
  });

  // 修复 FireFox 在拖动滚动条时，意外选中其他文字的 bug。
  useListener('selectstart', scrollRef, (event: any) => {
    if (event && event.explicitOriginalTarget === barRef.current) {
      event.preventDefault();
    }
  });

  // making scroll bar reacting to scroll event.
  const onScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const {scrollTop, scrollHeight} = event.currentTarget;
      setBarOffset((scrollTop / scrollHeight) * viewHeight);
    },
    [scrollRef]
  );

  // 下拉刷新功能
  const [pullLength, setPullLength] = useState(0);
  const isPullingDown = useRef(false);
  const lastTouch = useRef({x: 0, y: 0});
  const primaryTouchOffset = useRef(0);

  const scrollElementStyle = useMemo(() => {
    return {
      right: scrollElementRight,
      transform: `translateY(${pullLength}px)`,
    };
  }, [scrollElementRight, pullLength]);

  const onTouchStart: TouchEventHandler = useCallback((event) => {
    lastTouch.current.x = event.touches[0].clientX;
    lastTouch.current.y = event.touches[0].clientY;
    primaryTouchOffset.current = event.touches[0].clientY;
  }, []);
  const easeOutCubic = useCallback((x: number) => 1 - Math.pow(1 - x, 4), []);
  useEffect(() => {
    const touchMoveHandler = (event: TouchEvent) => {
      if (
        scrollRef.current.scrollTop === 0 &&
        event.touches[0].clientY > lastTouch.current.y
      ) {
        isPullingDown.current = true;
      }
      if (!isPullingDown.current) return;
      const moveDeltaOfPrimary =
        event.touches[0].clientY - primaryTouchOffset.current;
      const MAX_PULLDOWN_LENGTH = 200;
      const MAX_TRANSLATE_LENGTH = MAX_PULLDOWN_LENGTH / 2;
      const easedLength =
        easeOutCubic(
          Math.min(moveDeltaOfPrimary, MAX_PULLDOWN_LENGTH) /
          MAX_PULLDOWN_LENGTH
        ) * MAX_TRANSLATE_LENGTH * 0.8;
      setPullLength(Math.max(0, easedLength));
      lastTouch.current.x = event.touches[0].clientX;
      lastTouch.current.y = event.touches[0].clientY;
      event.preventDefault();
    };

    // to prevent browser's native bounce effect like safari and wechat x5 browser.
    scrollRef.current.addEventListener('touchmove', touchMoveHandler, {
      passive: false,
    });
    return () => {
      scrollRef.current.removeEventListener('touchmove', touchMoveHandler);
    };
  }, []);
  const onTouchEnd: TouchEventHandler = useCallback(() => {
    isPullingDown.current = false;
    setPullLength(0);
  }, []);
  const onTouchCancel: TouchEventHandler = useCallback(() => {
    isPullingDown.current = false;
    setPullLength(0);
  }, []);

  return (
    <div className="gui-scroll-bar-hider" style={{height: viewHeight}}>
      {/* scroll container */}
      <div
        className="gui-scroll-element"
        style={scrollElementStyle}
        ref={scrollRef}
        onScroll={onScroll}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchCancel}
      >
        {/* the content that needs scroll */}
        {children}
      </div>

      {/* scroll bar simulation */}
      <div
        className={classes(
          scrollBarClass,
          shouldSimulateScrollBar ? '' : 'hidden'
        )}
        ref={barRef}
        style={{
          height: barHeight,
          transform: `translateY(${barOffset}px)`,
        }}
        onMouseDown={onBarMouseDown}
      />
      <div className="indicator"/>
    </div>
  );
};

ScrollBar.defaultProps = {
  viewHeight: 500,
  scrollBarClass: 'gui-scroll-bar',
};

const useListener = (
  eventName: string,
  ref: React.MutableRefObject<HTMLElement>,
  listener: (event: Event) => void
) => {
  useEffect(() => {
    if (!ref.current) return;
    ref.current.addEventListener(eventName, listener);
    return () => {
      ref.current.removeEventListener(eventName, listener);
    };
  }, [ref]);
};

export default ScrollBar;
