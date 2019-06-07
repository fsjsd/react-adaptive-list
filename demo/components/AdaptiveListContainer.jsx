import React from "react";
import AdaptiveList from "../../src/AdaptiveList";
import Tombstone from "./Tombstone";

// simple fund to manage data loading scenarios for the list component
// This enables you to vary data page size, loading speed, 'load more'
// styling and total record count (for long lists)
const listManager = ({
  initialRowCount = 0,
  isCompleteOnInit = false,
  sideEffectSpeedMs = 2000,
  loadMoreStyle = "loadingindicator",
  pageSize = 5,
  totalRecords = 30
} = {}) => {
  let _id = 0;
  let makeId = func => ++_id && func();
  const itemMock = () =>
    makeId(() => ({
      id: _id,
      title: `Item #${_id}`
    }));

  const initialData = new Array(initialRowCount).fill(0).map(_ => itemMock());

  const handleLoadMore = onItemsReady => {
    window.setTimeout(() => {
      const newItems = new Array(pageSize).fill(0).map(_ => itemMock());
      let completed = _id > totalRecords;
      onItemsReady({ items: newItems, complete: completed });
    }, sideEffectSpeedMs);
  };

  return {
    initialData,
    isCompleteOnInit,
    handleLoadMore,
    loadMoreStyle
  };
};

const perfCompStyle = {
  height: "100%"
};

function AdaptiveListContainer() {
  // ============== Adaptive List ==============

  //const listManagerA = listManager();
  const listManagerA = listManager({
    initialRowCount: 0,
    sideEffectSpeedMs: 200,
    pageSize: 3,
    totalRecords: 500,
    loadMoreStyle: "loadingindicator"
  });
  const listManagerB = listManager({
    initialRowCount: 2,
    sideEffectSpeedMs: 500,
    pageSize: 2,
    totalRecords: 50,
    loadMoreStyle: "tombstones"
  });

  return (
    <div className="ListViewPane block-fill-height">
      <div className="Toolbar">Header</div>
      <div className="Lists">
        <AdaptiveList
          overscanAmount={20}
          initialData={listManagerA.initialData}
          isCompleteOnInit={listManagerA.isCompleteOnInit}
          onLoadMore={listManagerA.handleLoadMore}
          loadingMoreStyle={listManagerA.loadMoreStyle}
          rowHeight={60}
          renderRow={({ index, item, computedStyle }) => (
            <div
              key={index}
              id={`row${index}`}
              className="rowStyle"
              style={computedStyle}
            >
              <div>
                <b>{item.title}</b>
              </div>
              <div>List A: More detail</div>
            </div>
          )}
          renderTombstone={({ index, top }) => (
            <Tombstone style={{ top }} key={index} id={`tombstone${index}`} />
          )}
          renderEmptyList={() => <div>Empty</div>}
          renderLoadingMore={computedStyle => <div>Loading more....</div>}
        />
        <AdaptiveList
          initialData={listManagerB.initialData}
          isCompleteOnInit={listManagerB.isCompleteOnInit}
          onLoadMore={listManagerB.handleLoadMore}
          loadingMoreStyle={listManagerB.loadMoreStyle}
          rowHeight={60}
          renderRow={({ item, computedStyle, index }) => (
            <div
              key={index}
              id={`row${index}`}
              className="rowStyle"
              style={computedStyle}
            >
              <div>
                <b>{item.title}</b>
              </div>
              <div>List B: More detail</div>
            </div>
          )}
          renderTombstone={({ index, top }) => (
            <Tombstone
              style={{ top: top }}
              key={index}
              id={`tombstone${index}`}
            />
          )}
          renderEmptyList={() => <div>Empty</div>}
          renderLoadingMore={computedStyle => <div>Loading more....</div>}
        />
      </div>
      <div className="Toolbar">Footer</div>
    </div>
  );
}

export default AdaptiveListContainer;
