# react-adaptive-list component use cases

## Use Case 1: Initialised with no data

> { initialRows: [], isComplete: true }

=> call renderEmptyList() => renderProp for content when empty

## Use Case 2: Initialised with data

> { initialRows: [...rows], isComplete: true/false }

=> Immediately render. Show footer loading and request loadMore if isComplete=true

## Use Case 3: Initialised with no data, data loads after side effect

## Use Case 4: Component requests more data

### Use Case X.1: => Data is less than visible height and complete

### Use Case X.2: => Data is less than visible height and incomplete

### Use Case X.3: => Data is more than visible height and complete

### Use Case X.4: => Data is more than visible height and incomplete

# Rules

- Component must be given data and 'isComplete' on each request for a load.
- Component doesn't care how Container fetches it data and how it pages it.
- Component should call loadMore() with minimumPageLength recommendation for container
  - This will adjust based on current height of the view port and what overScan is set
- Container should manage state of whether data is being fetched of not
- [MAYBE] Container should ignore requests for further data from component
  - NO. If component waiting on a 'loadMore()' request it should not trigger more until Container responds with data or 'isComplete' response.
  - Container must handle sideEffect timeouts / errors - it's not the component's job to reason about the stability of the container's service
- Component 'Window virtualizaing' is a UI feature that is largely exclusive from data load
  concerns.
- Component scrolling will cause a 'wrapper' to adjust it's height/top/margin-top to control
  the scrollbar
- renderItem will be repeatedly called during scroll to re-render the rows. Should be some
  memo'd optimisation for this based on row index?
- Overscroll should be impossible, so a 'tombstone' render should not be necessary ... unless
  - row Item
