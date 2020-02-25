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
};

// simple func to manage data loading scenarios for the list component
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
  const itemMock = () =>
    makeId(() => ({
      id: _id,
      title: `Item #${_id}`
    }));

  const initialData = new Array(initialRowCount).fill(0).map(() => itemMock());

  const handleLoadMore = onItemsReady => {
    window.setTimeout(() => {
      const newItems = new Array(pageSize).fill(0).map(() => itemMock());
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
  });
  //

  return (
    <div style={styles.listViewPane} className="block-fill-height">
      <div style={styles.toolbar}>Header x</div>
      <div style={styles.lists}>
        <AdaptiveList
          style={styles.adaptiveList}
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
              style={{ ...styles.rowStyle, ...computedStyle }}
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
          renderLoadingMore={() => <div>Loading more....</div>}
        />
        <AdaptiveList
          style={styles.adaptiveList}
          initialData={listManagerB.initialData}
          isCompleteOnInit={listManagerB.isCompleteOnInit}
          onLoadMore={listManagerB.handleLoadMore}
          loadingMoreStyle={listManagerB.loadMoreStyle}
          rowHeight={60}
          renderRow={({ item, computedStyle, index }) => (
            <div
              key={index}
              id={`row${index}`}
              style={{ ...styles.rowStyle, ...computedStyle }}
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
          renderLoadingMore={() => <div>Loading more....</div>}
        />
        <AdaptiveList
          style={styles.adaptiveList}
          initialData={listManagerC.initialData}
          isCompleteOnInit={listManagerC.isCompleteOnInit}
          onLoadMore={listManagerC.handleLoadMore}
          loadingMoreStyle={listManagerC.loadMoreStyle}
          rowHeight={60}
          renderRow={({ item, computedStyle, index }) => (
            <div
              key={index}
              id={`row${index}`}
              style={{ ...styles.rowStyle, ...computedStyle }}
            >
              <div>
                <b>{item.title}</b>
              </div>
              <div>List C: More detail</div>
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
          renderLoadingMore={() => <div>Loading more....</div>}
        />
      </div>
      <div style={styles.toolbar}>Footer</div>
    </div>
  );
}

export default AdaptiveListContainer;
