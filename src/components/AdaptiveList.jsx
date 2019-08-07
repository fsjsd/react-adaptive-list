import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { useDebouncedCallback } from "use-debounce";
import { useAnimationFrame } from "../hooks/useAnimationFrame";

const scrollDebounceMs = 16;

const calcViewPortStyles = el => ({
  wrapperHeight: el.offsetHeight,
  viewportScrollTop: el.scrollTop,
  viewportScrollHeight: el.scrollHeight,
  reachedLimit: el.scrollTop + el.offsetHeight >= el.scrollHeight
});

const getElementPos = el => ({
  offsetHeight: el.offsetHeight,
  offsetTop: el.offsetTop,
  scrollTop: el.scrollTop,
  scrollHeight: el.scrollHeight
});

const AdaptiveList = ({
  initialData,
  isCompleteOnInit,
  onLoadMore,
  renderRow,
  renderEmptyList,
  renderLoadingMore,
  renderTombstone,
  rowHeight,
  overscanAmount = 5,
  loadingMoreStyle = "loadingindicator", // loadingindicator | tombstones
  ...props
}) => {
  // default loadingMore if none is provided
  if (!renderLoadingMore) {
    renderLoadingMore = () => <div>Loading ...</div>;
  }
  if (!renderTombstone) {
    renderTombstone = computedStyle => <div style={{ ...computedStyle }} />;
  }

  const [state, setState] = useState({
    items: initialData,
    isComplete: isCompleteOnInit,
    isLoadingMore: false,
    wrapperHeight: 0,
    wrapperVisibleHeight: 0,
    viewportScrollTop: 0,
    viewportScrollHeight: 0,
    viewportScrollPosition: 0,
    reachedLimit: false
  });

  //const [visibleViewportHeight, setVisibleViewportHeight] = useState(null);

  const overscan = rowHeight * overscanAmount;

  const setIsLoadingMore = useCallback(isLoadingMore => {
    setState(prevState => ({
      ...prevState,
      isLoadingMore
    }));
  }, []);

  // DOM reference to wrapping viewport element
  let viewportWrapperElRef = useRef();

  // DOM reference to 'load more' element at end of list.
  // if this is visibile or within overscan, trigger request
  // for more data
  let loadMoreElRef = useRef();

  const getViewportWrapper = useCallback(() => viewportWrapperElRef.current);

  //const getLoadMoreEl = () => loadMoreElRef.current;
  const getVisibleHeight = useCallback(() => {
    let el = getViewportWrapper();
    let visHeight = el
      ? parseFloat(window.getComputedStyle(el, null).getPropertyValue("height"))
      : 10000;
    return visHeight;
  }, [getViewportWrapper]);

  useAnimationFrame(() => {
    
  });

  // Debounce callback
  // https://github.com/xnimorz/use-debounce
  // Use { maxWait: 2000 } to emulate throttle?
  // https://github.com/xnimorz/use-debounce/blob/master/src/callback.js
  const [handleScroll] = useDebouncedCallback(
    // function
    e => {
      const styles = calcViewPortStyles(e.target);

      setState(prevState => ({
        ...prevState,
        wrapperVisibleHeight: getVisibleHeight(),
        wrapperHeight: styles.offsetHeight,
        viewportScrollTop: styles.viewportScrollTop,
        viewportScrollHeight: styles.viewportScrollHeight,
        reachedLimit: styles.reachedLimit
      }));
    },
    // delay in ms
    scrollDebounceMs,
    { maxWait: scrollDebounceMs }
  );

  const shouldLoadMore = useCallback(() => {
    // don't attempt loading more if already in flight
    // drop out immediately on these flags to optimise repeat calls early
    if (state.isComplete || state.isLoadingMore) return false;

    const viewportWrapper = getViewportWrapper();
    const currentWrapperPos = viewportWrapper && getElementPos(viewportWrapper);

    // drop out if initialising
    if (!currentWrapperPos) return false;

    const loadMoreTop = state.items.length * rowHeight;

    // if loadMoreElRef is visible or within overscan, request more data
    const loadingVisible =
      loadMoreTop - viewportWrapper.offsetTop <
      viewportWrapper.offsetHeight + viewportWrapper.scrollTop;

    if (!loadingVisible) {
      return false;
    } else {
      setIsLoadingMore(true);
      onLoadMore(onMoreLoaded);
      return true;
    }
  }); //, [state.isComplete, state.isLoadingMore]);

  // callback when container component provides more
  // data after side effects
  const onMoreLoaded = ({ items, complete }) => {
    setState(prevState => ({
      ...prevState,
      items: [...prevState.items, ...items],
      isComplete: complete,
      isLoadingMore: false // mark component as ready to load more
    }));
  };

  const isRowVisibleInViewPort = useCallback(
    (rowIndex, includeTopOverscan = true) => {
      const visibleHeight = state.wrapperVisibleHeight;

      // render nothing until DOM established
      if (visibleHeight === 0) return false;

      const overscanAdjusted = includeTopOverscan ? overscan : 0;
      const rowTop = rowIndex * rowHeight;
      const rowBottom = rowTop + rowHeight;
      const topVis = rowTop >= state.viewportScrollTop - overscanAdjusted;
      const bottomVis =
        rowBottom <= state.viewportScrollTop + visibleHeight + overscan;

      return topVis && bottomVis;
    },
    [state.wrapperVisibleHeight, state.viewportScrollTop, overscan, rowHeight]
  );

  const visibleTombStonePositions = useCallback(() => {
    const tombStoneStartingTop = tombStoneIndex => tombStoneIndex * rowHeight;
    let lastItemIndex = state.items.length - 1;

    const tombstones = [];

    // Generate 'fake' ts rows for every items beyond the current viewport, up to one page deep
    while (isRowVisibleInViewPort(++lastItemIndex, false)) {
      tombstones.push({
        index: `ts${lastItemIndex}`,
        top: `${tombStoneStartingTop(lastItemIndex)}px`
      });
    }

    return tombstones;
  }, [isRowVisibleInViewPort, rowHeight, state.items.length]);

  // on mount
  useEffect(() => {
    getViewportWrapper().addEventListener("resize", handleScroll);
    getViewportWrapper().addEventListener("scroll", handleScroll, {
      passive: true
    });

    // calc on mount
    setState(prevState => ({
      ...prevState,
      wrapperVisibleHeight: getVisibleHeight()
    }));

    // trigger on mount
    shouldLoadMore("onmount");

    // detach on unmount
    return () => {
      let wrapperRef = getViewportWrapper();
      wrapperRef &&
        getViewportWrapper().removeEventListener("scroll", handleScroll);
      wrapperRef &&
        getViewportWrapper().removeEventListener("resize", handleScroll);
    };
  }, [getViewportWrapper, getVisibleHeight, handleScroll, shouldLoadMore]);

  return (
    <div
      {...props}
      style={{
        ...(props.style || {})
      }}
      ref={viewportWrapperElRef}
    >
      {state.isComplete && state.items.length === 0 && renderEmptyList()}
      {state.items.map(
        (item, index) =>
          isRowVisibleInViewPort(index) &&
          renderRow({
            index: index,
            item,
            computedStyle: {
              transform: `translate(0px, ${index * rowHeight}px)`
            }
          })
      )}
      {state.isLoadingMore &&
        loadingMoreStyle === "tombstones" &&
        visibleTombStonePositions().map(tombStoneInfo =>
          renderTombstone(tombStoneInfo)
        )}
      <div
        ref={loadMoreElRef}
        style={{
          position: "absolute",
          transform: `translate(0px, ${state.items.length * rowHeight}px)`
        }}
      >
        {// show loading indictor if loading more or
        // if loadMore callback initiated via shouldLoadMore(),
        // and if set component style
        (state.isLoadingMore || shouldLoadMore()) &&
        loadingMoreStyle === "loadingindicator" ? (
          renderLoadingMore()
        ) : (
          <div>&nbsp;</div>
        )}
      </div>
    </div>
  );
};

AdaptiveList.propTypes = {
  initialData: PropTypes.array.isRequired,
  isCompleteOnInit: PropTypes.bool.isRequired,
  onLoadMore: PropTypes.func.isRequired,
  renderRow: PropTypes.func.isRequired,
  renderEmptyList: PropTypes.func.isRequired,
  renderLoadingMore: PropTypes.func,
  renderTombstone: PropTypes.func,
  overscanAmount: PropTypes.number
};

export default React.memo(AdaptiveList);
