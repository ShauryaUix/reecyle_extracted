/* eslint-disable react/forbid-foreign-prop-types */

import InfiniteScroller from "react-infinite-scroller";

if (InfiniteScroller.propTypes) {
  delete InfiniteScroller.propTypes.element;
}

export default InfiniteScroller;
