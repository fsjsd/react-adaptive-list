function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import PropTypes from "prop-types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useAnimationFrame } from "./useAnimationFrame";
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
  style,
  initialData,
  isCompleteOnInit,
  onLoadMore,
  renderRow,
  renderEmptyList,
  renderLoadingMore,
  renderTombstone,
  rowHeight,
  overscanAmount = 5,
  loadingMoreStyle = "loadingindicator",
  // loadingindicator | tombstones
  ...props
}) => {
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
    setState(prevState => ({ ...prevState,
      isLoadingMore
    }));
  }, []); // DOM reference to wrapping viewport element

  let viewportWrapperElRef = useRef(); // DOM reference to 'load more' element at end of list.
  // if this is visibile or within overscan, trigger request
  // for more data

  let loadMoreElRef = useRef();
  const getViewportWrapper = useCallback(() => viewportWrapperElRef.current, [viewportWrapperElRef]); //const getLoadMoreEl = () => loadMoreElRef.current;

  const getVisibleHeight = useCallback(() => {
    let el = getViewportWrapper();
    let visHeight = el ? parseFloat(window.getComputedStyle(el, null).getPropertyValue("height")) : 10000;
    return visHeight;
  }, [getViewportWrapper]);
  useAnimationFrame(() => {}); // Debounce callback
  // https://github.com/xnimorz/use-debounce
  // Use { maxWait: 2000 } to emulate throttle?
  // https://github.com/xnimorz/use-debounce/blob/master/src/callback.js

  const [handleScroll] = useDebouncedCallback( // function
  e => {
    const styles = calcViewPortStyles(e.target);
    setState(prevState => ({ ...prevState,
      wrapperVisibleHeight: getVisibleHeight(),
      wrapperHeight: styles.offsetHeight,
      viewportScrollTop: styles.viewportScrollTop,
      viewportScrollHeight: styles.viewportScrollHeight,
      reachedLimit: styles.reachedLimit
    }));
  }, // delay in ms
  scrollDebounceMs, {
    maxWait: scrollDebounceMs
  });
  const shouldLoadMore = useCallback(() => {
    // don't attempt loading more if already in flight
    // drop out immediately on these flags to optimise repeat calls early
    if (state.isComplete || state.isLoadingMore) return false;
    const viewportWrapper = getViewportWrapper();
    const currentWrapperPos = viewportWrapper && getElementPos(viewportWrapper); // drop out if initialising

    if (!currentWrapperPos) return false;
    const loadMoreTop = state.items.length * rowHeight; // if loadMoreElRef is visible or within overscan, request more data

    const loadingVisible = loadMoreTop - viewportWrapper.offsetTop < viewportWrapper.offsetHeight + viewportWrapper.scrollTop;

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

  const onMoreLoaded = ({
    items,
    complete
  }) => {
    setState(prevState => ({ ...prevState,
      items: [...prevState.items, ...items],
      isComplete: complete,
      isLoadingMore: false // mark component as ready to load more

    }));
  };

  const isRowVisibleInViewPort = useCallback((rowIndex, includeTopOverscan = true) => {
    const visibleHeight = state.wrapperVisibleHeight; // render nothing until DOM established

    if (visibleHeight === 0) return false;
    const overscanAdjusted = includeTopOverscan ? overscan : 0;
    const rowTop = rowIndex * rowHeight;
    const rowBottom = rowTop + rowHeight;
    const topVis = rowTop >= state.viewportScrollTop - overscanAdjusted;
    const bottomVis = rowBottom <= state.viewportScrollTop + visibleHeight + overscan;
    return topVis && bottomVis;
  }, [state.wrapperVisibleHeight, state.viewportScrollTop, overscan, rowHeight]);
  const visibleTombStonePositions = useCallback(() => {
    const tombStoneStartingTop = tombStoneIndex => tombStoneIndex * rowHeight;

    let lastItemIndex = state.items.length - 1;
    const tombstones = []; // Generate 'fake' ts rows for every items beyond the current viewport, up to one page deep

    while (isRowVisibleInViewPort(++lastItemIndex, false)) {
      tombstones.push({
        index: `ts${lastItemIndex}`,
        top: `${tombStoneStartingTop(lastItemIndex)}px`
      });
    }

    return tombstones;
  }, [isRowVisibleInViewPort, rowHeight, state.items.length]); // on mount

  useEffect(() => {
    getViewportWrapper().addEventListener("resize", handleScroll);
    getViewportWrapper().addEventListener("scroll", handleScroll, {
      passive: true
    }); // calc on mount

    setState(prevState => ({ ...prevState,
      wrapperVisibleHeight: getVisibleHeight()
    })); // trigger on mount

    shouldLoadMore("onmount"); // detach on unmount

    return () => {
      let wrapperRef = getViewportWrapper();
      wrapperRef && getViewportWrapper().removeEventListener("scroll", handleScroll);
      wrapperRef && getViewportWrapper().removeEventListener("resize", handleScroll);
    };
  }, [getViewportWrapper, getVisibleHeight, handleScroll, shouldLoadMore]);
  return (
    /*#__PURE__*/
    React.createElement("div", _extends({}, props, {
      style: { ...(style || {})
      },
      ref: viewportWrapperElRef
    }), state.isComplete && state.items.length === 0 && renderEmptyList(), state.items.map((item, index) => isRowVisibleInViewPort(index) && renderRow({
      index: index,
      item,
      computedStyle: {
        transform: `translate(0px, ${index * rowHeight}px)`
      }
    })), state.isLoadingMore && loadingMoreStyle === "tombstones" && visibleTombStonePositions().map(tombStoneInfo => renderTombstone ? renderTombstone(tombStoneInfo) :
    /*#__PURE__*/
    React.createElement("div", null)),
    /*#__PURE__*/
    React.createElement("div", {
      ref: loadMoreElRef,
      style: {
        position: "absolute",
        transform: `translate(0px, ${state.items.length * rowHeight}px)`
      }
    }, // show loading indictor if loading more or
    // if loadMore callback initiated via shouldLoadMore(),
    // and if set component style
    (state.isLoadingMore || shouldLoadMore()) && loadingMoreStyle === "loadingindicator" ? renderLoadingMore ? renderLoadingMore() :
    /*#__PURE__*/
    React.createElement("div", null, "Loading ...") :
    /*#__PURE__*/
    React.createElement("div", null, "\xA0")))
  );
};

AdaptiveList.propTypes = {
  style: PropTypes.object.isRequired,
  initialData: PropTypes.array.isRequired,
  isCompleteOnInit: PropTypes.bool.isRequired,
  onLoadMore: PropTypes.func.isRequired,
  renderRow: PropTypes.func.isRequired,
  renderEmptyList: PropTypes.func.isRequired,
  renderLoadingMore: PropTypes.func,
  renderTombstone: PropTypes.func,
  rowHeight: PropTypes.number,
  overscanAmount: PropTypes.number,
  loadingMoreStyle: PropTypes.string
};
export default
/*#__PURE__*/
React.memo(AdaptiveList);
import React from "react";
import AdaptiveList from "./AdaptiveList";
import Tombstone from "./Tombstone";
const LoadMoreStyles = {
  LoadingIndicator: "loadingindicator",
  TombStones: "tombstones"
};
const styles = {
  toolbar: {
    padding: "10px",
    flexGrow: "1"
  },
  listViewPane: {
    display: "flex",
    flexDirection: "column",
    height: "100%"
  },
  lists: {
    flexGrow: "2",
    display: "flex",
    height: "100%",
    flexDirection: "row",
    width: "100%"
  },
  adaptiveList: {
    border: "solid 1px #bbb",
    flexGrow: "1",
    height: "100%",
    boxSizing: "border-box",
    overflowY: "auto",
    position: "relative"
  },
  rowStyle: {
    boxSizing: "border-box",
    padding: "15px",
    height: "60px",
    position: "absolute",
    width: "100%"
  }
}; // simple func to manage data loading scenarios for the list component
// This enables you to vary data page size, loading speed, 'load more'
// styling and total record count (for long lists)

const listManager = ({
  initialRowCount = 0,
  isCompleteOnInit = false,
  sideEffectSpeedMs = 2000,
  loadMoreStyle = LoadMoreStyles.LoadingIndicator,
  pageSize = 5,
  totalRecords = 30
} = {}) => {
  let _id = 0;

  let makeId = func => ++_id && func();

  const itemMock = () => makeId(() => ({
    id: _id,
    title: `Item #${_id}`
  }));

  const initialData = new Array(initialRowCount).fill(0).map(() => itemMock());

  const handleLoadMore = onItemsReady => {
    window.setTimeout(() => {
      const newItems = new Array(pageSize).fill(0).map(() => itemMock());
      let completed = _id > totalRecords;
      onItemsReady({
        items: newItems,
        complete: completed
      });
    }, sideEffectSpeedMs);
  };

  return {
    initialData,
    isCompleteOnInit,
    handleLoadMore,
    loadMoreStyle
  };
};

function AdaptiveListContainer() {
  // ============== Adaptive List ==============
  //const listManagerA = listManager();
  const listManagerA = listManager({
    initialRowCount: 0,
    sideEffectSpeedMs: 200,
    pageSize: 3,
    totalRecords: 5000,
    loadMoreStyle: LoadMoreStyles.LoadingIndicator
  });
  const listManagerB = listManager({
    initialRowCount: 2,
    sideEffectSpeedMs: 500,
    pageSize: 2,
    totalRecords: 50,
    loadMoreStyle: LoadMoreStyles.TombStones
  });
  const listManagerC = listManager({
    isCompleteOnInit: false,
    initialRowCount: 3000,
    sideEffectSpeedMs: 0,
    pageSize: 200,
    totalRecords: 300000,
    loadMoreStyle: LoadMoreStyles.TombStones
  }); //

  return (
    /*#__PURE__*/
    React.createElement("div", {
      style: styles.listViewPane,
      className: "block-fill-height"
    },
    /*#__PURE__*/
    React.createElement("div", {
      style: styles.toolbar
    }, "Header x"),
    /*#__PURE__*/
    React.createElement("div", {
      style: styles.lists
    },
    /*#__PURE__*/
    React.createElement(AdaptiveList, {
      style: styles.adaptiveList,
      overscanAmount: 20,
      initialData: listManagerA.initialData,
      isCompleteOnInit: listManagerA.isCompleteOnInit,
      onLoadMore: listManagerA.handleLoadMore,
      loadingMoreStyle: listManagerA.loadMoreStyle,
      rowHeight: 60,
      renderRow: ({
        index,
        item,
        computedStyle
      }) =>
      /*#__PURE__*/
      React.createElement("div", {
        key: index,
        id: `row${index}`,
        style: { ...styles.rowStyle,
          ...computedStyle
        }
      },
      /*#__PURE__*/
      React.createElement("div", null,
      /*#__PURE__*/
      React.createElement("b", null, item.title)),
      /*#__PURE__*/
      React.createElement("div", null, "List A: More detail")),
      renderTombstone: ({
        index,
        top
      }) =>
      /*#__PURE__*/
      React.createElement(Tombstone, {
        style: {
          top
        },
        key: index,
        id: `tombstone${index}`
      }),
      renderEmptyList: () =>
      /*#__PURE__*/
      React.createElement("div", null, "Empty"),
      renderLoadingMore: () =>
      /*#__PURE__*/
      React.createElement("div", null, "Loading more....")
    }),
    /*#__PURE__*/
    React.createElement(AdaptiveList, {
      style: styles.adaptiveList,
      initialData: listManagerB.initialData,
      isCompleteOnInit: listManagerB.isCompleteOnInit,
      onLoadMore: listManagerB.handleLoadMore,
      loadingMoreStyle: listManagerB.loadMoreStyle,
      rowHeight: 60,
      renderRow: ({
        item,
        computedStyle,
        index
      }) =>
      /*#__PURE__*/
      React.createElement("div", {
        key: index,
        id: `row${index}`,
        style: { ...styles.rowStyle,
          ...computedStyle
        }
      },
      /*#__PURE__*/
      React.createElement("div", null,
      /*#__PURE__*/
      React.createElement("b", null, item.title)),
      /*#__PURE__*/
      React.createElement("div", null, "List B: More detail")),
      renderTombstone: ({
        index,
        top
      }) =>
      /*#__PURE__*/
      React.createElement(Tombstone, {
        style: {
          top: top
        },
        key: index,
        id: `tombstone${index}`
      }),
      renderEmptyList: () =>
      /*#__PURE__*/
      React.createElement("div", null, "Empty"),
      renderLoadingMore: () =>
      /*#__PURE__*/
      React.createElement("div", null, "Loading more....")
    }),
    /*#__PURE__*/
    React.createElement(AdaptiveList, {
      style: styles.adaptiveList,
      initialData: listManagerC.initialData,
      isCompleteOnInit: listManagerC.isCompleteOnInit,
      onLoadMore: listManagerC.handleLoadMore,
      loadingMoreStyle: listManagerC.loadMoreStyle,
      rowHeight: 60,
      renderRow: ({
        item,
        computedStyle,
        index
      }) =>
      /*#__PURE__*/
      React.createElement("div", {
        key: index,
        id: `row${index}`,
        style: { ...styles.rowStyle,
          ...computedStyle
        }
      },
      /*#__PURE__*/
      React.createElement("div", null,
      /*#__PURE__*/
      React.createElement("b", null, item.title)),
      /*#__PURE__*/
      React.createElement("div", null, "List C: More detail")),
      renderTombstone: ({
        index,
        top
      }) =>
      /*#__PURE__*/
      React.createElement(Tombstone, {
        style: {
          top: top
        },
        key: index,
        id: `tombstone${index}`
      }),
      renderEmptyList: () =>
      /*#__PURE__*/
      React.createElement("div", null, "Empty"),
      renderLoadingMore: () =>
      /*#__PURE__*/
      React.createElement("div", null, "Loading more....")
    })),
    /*#__PURE__*/
    React.createElement("div", {
      style: styles.toolbar
    }, "Footer"))
  );
}

export default AdaptiveListContainer;
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React from "react";
const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "row",
    position: "absolute",
    boxSizing: "border-box",
    padding: "15px",
    height: "60px",
    width: "100%"
  },
  avatar: {
    backgroundColor: "#eee",
    width: "40px",
    height: "40px",
    marginRight: "10px"
  },
  background: {
    backgroundColor: "#eee",
    animationName: "color",
    animationDuration: "1s",
    animationIterationCount: "infinite"
  },
  textWrapper: {
    flexGrow: "2"
  },
  text: {
    fontSize: "10px",
    height: "15px",
    flexGrow: "2"
  }
};

function Tombstone({
  style,
  ...restProps
}) {
  return (
    /*#__PURE__*/
    React.createElement("div", _extends({
      style: { ...styles.wrapper,
        ...style
      }
    }, restProps),
    /*#__PURE__*/
    React.createElement("div", {
      style: { ...styles.background,
        ...styles.avatar
      }
    }),
    /*#__PURE__*/
    React.createElement("div", {
      style: styles.textWrapper
    },
    /*#__PURE__*/
    React.createElement("div", {
      style: {
        width: "20%",
        marginBottom: "10px",
        ...styles.background,
        ...styles.text
      }
    }),
    /*#__PURE__*/
    React.createElement("div", {
      style: { ...styles.background,
        ...styles.text
      }
    })))
  ); //#{index} {top}
}

export default Tombstone;
import React from "react";
import ReactDOM from "react-dom";
import Tombstone from "./Tombstone";
it("stub", () => {});
import { useRef, useCallback, useEffect, useLayoutEffect } from "react";
export const useAnimationFrame = callback => {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  const loop = useCallback(() => {
    frameRef.current = requestAnimationFrame(loop);
    const cb = callbackRef.current;
    cb();
  });
  const frameRef = useRef();
  useLayoutEffect(() => {
    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [loop]);
};
