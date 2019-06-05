import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { useDebouncedCallback } from "use-debounce";

const style = {
  wrapper: {
    //overflowY: 'auto',
  }
};

const scrollDebounceMs = 30;

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
  loadingMoreStyle = "loadingindicator" // loadingindicator | tombstones
}) => {
  //console.log("AdaptiveList::ctor");

  // default loadingMore if none is provided
  if (!renderLoadingMore) {
    renderLoadingMore = () => <div>Loading &hellip;</div>;
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

  const overscan = rowHeight * overscanAmount;

  const setIsLoadingMore = useCallback(isLoadingMore => {
    // setState(prevState => ({
    //   ...prevState,
    //   isLoadingMore: isLoadingMore
    // }));
    setState(prevState => ({
      ...prevState,
      isLoadingMore
    }));
    // TODO:
  }, []);

  // DOM reference to wrapping viewport element
  let viewportWrapperElRef = useRef();

  // DOM reference to 'load more' element at end of list.
  // if this is visibile or within overscan, trigger request
  // for more data
  let loadMoreElRef = useRef();

  const getViewportWrapper = () => viewportWrapperElRef.current;
  const getLoadMoreEl = () => loadMoreElRef.current;
  const getVisibleHeight = useCallback(() => {
    let el = getViewportWrapper();
    let visHeight = el
      ? parseFloat(window.getComputedStyle(el, null).getPropertyValue("height"))
      : 10000;
    //console.log(visHeight, el);
    return visHeight;
  }, []);

  //const getViewportWrapperClientRect = () => getViewportWrapper().getBoundingClientRect();

  // Debounce callback
  // https://github.com/xnimorz/use-debounce
  // Use { maxWait: 2000 } to emulate throttle?
  // https://github.com/xnimorz/use-debounce/blob/master/src/callback.js
  const [handleScroll] = useDebouncedCallback(
    // function
    e => {
      //console.log("handleScroll");
      setState(prevState => ({
        ...prevState,
        wrapperHeight: e.target.offsetHeight,
        wrapperVisibleHeight: getVisibleHeight(),
        viewportScrollTop: e.target.scrollTop,
        viewportScrollHeight: e.target.scrollHeight,
        reachedLimit:
          e.target.scrollTop + e.target.offsetHeight >= e.target.scrollHeight
      }));
    },
    // delay in ms
    scrollDebounceMs,
    { maxWait: scrollDebounceMs }
  );

  const getElementPos = el => ({
    offsetHeight: el.offsetHeight,
    offsetTop: el.offsetTop,
    scrollTop: el.scrollTop,
    scrollHeight: el.scrollHeight
  });

  const shouldLoadMore = () => {
    // don't attempt loading more if already in flight
    // drop out immediately on these flags to optimise repeat calls early
    if (state.isComplete || state.isLoadingMore) return false;

    const viewportWrapper = getViewportWrapper();
    const loadMoreEl = getLoadMoreEl();
    const currentWrapperPos = viewportWrapper && getElementPos(viewportWrapper);
    const latestWrapperPos = loadMoreEl && getElementPos(loadMoreEl);
    //const visibleHeight = getVisibleHeight();

    //console.log('shouldLoadMore', state.items.length, { isComplete: state.isComplete, isLoadingMore: state.isLoadingMore }, currentWrapperPos, loadMoreEl, latestWrapperPos);

    // drop out if initialising
    if (!currentWrapperPos || !latestWrapperPos) return false;

    // if loadMoreElRef is visible or within overscan, request more data
    const loadingVisible =
      loadMoreEl.offsetTop - viewportWrapper.offsetTop <
      viewportWrapper.offsetHeight + viewportWrapper.scrollTop;

    /* console.log("shouldLoadMore", {
      loadMoreOffTop: loadMoreEl.offsetTop,
      wrapperOffTop: viewportWrapper.offsetTop,
      wrapperOffHeight: viewportWrapper.offsetHeight,
      wrapperScrollTop: viewportWrapper.scrollTop,
      loadMoreVis: loadingVisible,
      isLoadingMore: state.isLoadingMore
    }); */

    if (!loadingVisible) {
      //console.log("EXIT");
      return false;
    } else {
      //console.log("LOAD MORE");

      setIsLoadingMore(true);

      onLoadMore(onMoreLoaded);

      return true;
    }
  }; //, [state.isComplete, state.isLoadingMore]);

  // callback when container component provides more
  // data after side effects
  const onMoreLoaded = ({ items, complete }) => {
    //console.log('onMoreLoaded', state.items.length, items.length, complete);
    setState(prevState => ({
      ...prevState,
      items: [...prevState.items, ...items],
      isComplete: complete,
      // mark component as ready to load more
      isLoadingMore: false
    }));
  };

  const isRowVisibleInViewPort = useCallback(
    (rowIndex, includeTopOverscan = true) => {
      const visibleHeight = getVisibleHeight();

      // render nothing until DOM established
      if (visibleHeight === 0) return false;

      const overscanAdjusted = includeTopOverscan ? overscan : 0;
      const rowTop = rowIndex * rowHeight;
      const rowBottom = rowTop + rowHeight;
      const topVis = rowTop >= state.viewportScrollTop - overscanAdjusted;
      const bottomVis =
        rowBottom <= state.viewportScrollTop + visibleHeight + overscan;

      /*
      console.log("isRowVisibleInViewPort", {
        rowIndex,
        rowBottom,
        vwScrollTop: state.viewportScrollTop,
        vwHeight: visibleHeight,
        topVis,
        bottomVis
      });
      */

      return topVis && bottomVis;
    },
    [rowHeight, overscan, state.viewportScrollTop, getVisibleHeight]
  );

  const visibleTombStonePositions = useCallback(() => {
    // spec. Generate 'fake' ts rows for every items beyond the current viewport, up to one page deep

    const tombStoneStartingTop = tombStoneIndex => tombStoneIndex * rowHeight;
    let lastItemIndex = state.items.length - 1;

    const tombstones = [];

    while (isRowVisibleInViewPort(++lastItemIndex, false)) {
      tombstones.push({
        index: `ts${lastItemIndex}`,
        top: `${tombStoneStartingTop(lastItemIndex)}px`
      });
    }
    //isRowVisibleInViewPort;
    console.log();

    return tombstones;
  }, [rowHeight, state.items.length]);

  // on mount
  useEffect(() => {
    console.log("attach scroll events");
    getViewportWrapper().addEventListener("resize", handleScroll);
    getViewportWrapper().addEventListener("scroll", handleScroll, {
      passive: true
    });

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
  }, []);

  return (
    <div
      className="AdaptiveList"
      style={style.wrapper}
      ref={viewportWrapperElRef}
    >
      {state.isComplete && state.items.length === 0 && renderEmptyList()}
      {state.items.map(
        (item, index) =>
          isRowVisibleInViewPort(index) &&
          renderRow({
            index: index,
            item,
            computedStyle: { top: index * rowHeight }
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
          top: state.items.length * rowHeight
        }}
      >
        {// show loading indictor if loading more or load initiated
        // via shouldLoadMore(), and if set style
        (state.isLoadingMore || shouldLoadMore()) &&
        loadingMoreStyle === "loadingindicator" ? (
          renderLoadingMore()
        ) : (
          <div>Loading</div>
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
