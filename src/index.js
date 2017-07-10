import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

/**
 * StickyList - react sticky header listview
 *
 * HTML struts:
 *
 * .sl-wrap
 *    .sl-group
 *        .sl-header
 *        .sl-items
 *    .sl-group
 *        .sl-header
 *        .sl-items
 *    ...
 */
export default class StickyList extends PureComponent {

  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.string,
    /**
     * data to render
     */
    data: PropTypes.arrayOf(PropTypes.shape({
      /**
       * key for this group, for improve performance
       */
      key: PropTypes.any,
      /**
       * header display for a group of items
       */
      header: PropTypes.any,
      /**
       * display for a group of items
       */
      items: PropTypes.any,
    })),
  }

  headerMap = {};
  $firstItems;
  stickyIndex = 0;
  lastWrapScrollTop = 0;

  componentDidMount() {
    this.listenScroll();
    this.stickyFirstHeader();
  }

  componentWillUnmount() {
    this.unlistenScroll();
  }

  componentWillReceiveProps(nextProps) {
    const { data } = this.props;
    if (data !== nextProps.data) {
      this.headerMap = {};
      this.stickyIndex = 0;
    }
  }

  componentWillUpdate() {
    this.unlistenScroll();
  }

  componentDidUpdate() {
    this.listenScroll();
    this.stickyFirstHeader();
  }

  listenScroll = () => {
    this.$wrap.addEventListener('scroll', this.onScroll, false);
  }

  unlistenScroll = () => {
    this.$wrap.removeEventListener('scroll', this.onScroll);
  }

  stickyFirstHeader = () => {
    const $stickyHeader = this.headerMap[0];
    Object.assign($stickyHeader.style, {
      position: 'absolute',
      top: 0,
    });
    if (this.$firstItems) {
      this.$firstItems.style.borderTop = `${$stickyHeader.clientHeight}px solid transparent`;
    }
  }

  onScroll = () => {
    const { headerMap, stickyIndex, lastWrapScrollTop } = this;

    const wrapScrollTop = this.$wrap.scrollTop;
    // scroll up or down, true is down false is up
    const goDown = wrapScrollTop - lastWrapScrollTop > 0;
    this.lastWrapScrollTop = wrapScrollTop;
    const $stickyHeader = headerMap[stickyIndex];
    const nextIndex = goDown ? stickyIndex + 1 : stickyIndex - 1;
    const $nextHeader = headerMap[nextIndex];

    if ($nextHeader) {
      const { offsetTop: groupOffsetTop } = $nextHeader;

      const updateToNextSticky = () => {
        // fix next
        Object.assign($nextHeader.style, {
          position: 'absolute',
          top: `${wrapScrollTop}px`,
        });
        // restore pre
        Object.assign($stickyHeader.style, {
          position: '',
          top: '',
        });
        this.stickyIndex = nextIndex;
      }

      if (goDown) {
        if (wrapScrollTop >= groupOffsetTop) {
          updateToNextSticky();
          return;
        }
      } else {
        if (wrapScrollTop <= groupOffsetTop) {
          updateToNextSticky();
          return;
        }
      }
    }

    // refresh current stickyGroup
    Object.assign($stickyHeader.style, {
      position: 'absolute',
      top: `${wrapScrollTop}px`,
    });
  }

  render() {
    const { headerMap } = this;
    const { data = [], className, style } = this.props

    return (
      <div
        className={classnames('sl-wrap', className)}
        style={Object.assign({
          height: '100%',
          overflowY: 'scroll',
          position: 'relative',
        }, style)}
        ref={$wrap => this.$wrap = $wrap}
      >
        {data.map(({ header, items, key }, index) => (
          <div
            className="sl-group"
            key={key !== undefined ? key : index}
          >
            <div
              className="sl-header"
              style={{
                width: '100%',
              }}
              ref={header => {
                headerMap[index] = header;
              }}
            >{header}</div>
            <div
              className="sl-items"
              ref={items => {
                if (index === 0) {
                  this.$firstItems = items;
                }
              }}
            >{items}</div>
          </div>
        ))}
      </div>
    )
  }
}
