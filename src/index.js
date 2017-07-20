import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

function setStickyCSS($ele, top) {
  Object.assign($ele.style, {
    position: 'absolute',
    top: `${top}px`,
  });
}

function setDefaultCSS($ele) {
  Object.assign($ele.style, {
    position: '',
    top: '',
  });
}

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
export default class StickyList extends Component {

  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
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

  $groupMap = {};
  $firstItem;
  stickyIndex = 0;
  lastWrapScrollTop = 0;

  componentDidMount() {
    this.listenScroll();
    this.stickyFirstHeader();
  }

  componentWillUnmount() {
    this.unlistenScroll();
  }

  shouldComponentUpdate(nextProps) {
    const { data, className, style } = this.props;
    return data !== nextProps.data || className !== nextProps.className || style !== nextProps.style;
  }

  componentWillReceiveProps(nextProps) {
    const { data } = this.props;
    if (data !== nextProps.data) {
      this.$groupMap = {};
      this.stickyIndex = 0;
      this.$firstItem = null;
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
    this.$wrap.addEventListener('scroll', this.onScroll);
  }

  unlistenScroll = () => {
    this.$wrap.removeEventListener('scroll', this.onScroll);
  }

  stickyFirstHeader = () => {
    const $stickyHeader = this.$groupMap[0].firstChild;
    setStickyCSS($stickyHeader, 0);
    if (this.$firstItem) {
      this.$firstItem.style.borderTop = `${$stickyHeader.clientHeight}px solid transparent`;
    }
  }

  onScroll = () => {
    const { $groupMap, stickyIndex, lastWrapScrollTop } = this;

    const wrapScrollTop = this.$wrap.scrollTop;
    // scroll up or down, true is down false is up
    const goDown = wrapScrollTop - lastWrapScrollTop > 0;
    this.lastWrapScrollTop = wrapScrollTop;

    const $stickyGroup = $groupMap[stickyIndex];
    const $stickyHeader = $stickyGroup.firstChild;
    const nextIndex = goDown ? stickyIndex + 1 : stickyIndex - 1;
    const $nextGroup = $groupMap[nextIndex];

    const doAnimation = () => {
      if ($nextGroup) {
        let $nextHeader = $nextGroup.firstChild;

        const updateToNextSticky = () => {
          // fix next
          setStickyCSS($nextHeader, wrapScrollTop);
          // restore pre
          setDefaultCSS($stickyHeader);
          this.stickyIndex = nextIndex;
        }

        const { offsetTop: groupOffsetTop, offsetHeight: groupHeight } = $nextGroup;
        // groupOffsetTop is static const value
        // wrapScrollTop is val value change as scroll
        if (goDown) {
          // wrapScrollTop become bigger
          if (wrapScrollTop >= groupOffsetTop) {
            updateToNextSticky();
            return;
          }
        } else {
          // wrapScrollTop become smaller
          if (wrapScrollTop <= groupOffsetTop + groupHeight) {
            updateToNextSticky();
            return;
          }
        }
      }
      // refresh current stickyGroup
      setStickyCSS($stickyHeader, wrapScrollTop);
    }

    // 使用window.requestAnimationFrame()，让读操作和写操作分离，把所有的写操作放到下一次重新渲染。
    const requestAnimationFrame = window.requestAnimationFrame;
    if (requestAnimationFrame) {
      window.requestAnimationFrame(doAnimation);
    } else {
      doAnimation();
    }
  }

  /**
   * scroll to a group
   * @param index group index start on 0
   */
  scrollTo = (index) => {
    const { $groupMap, $wrap, stickyIndex } = this;
    const $stickyHeader = $groupMap[stickyIndex].firstChild;
    const $group = $groupMap[index];
    if ($group !== undefined) {
      const $header = $group.firstChild;
      // restore pre
      setDefaultCSS($stickyHeader);
      this.stickyIndex = index;
      $wrap.scrollTop = $header.offsetTop - $header.clientHeight;
      // fire scroll event
      this.onScroll();
    }
  }

  render() {
    const { $groupMap } = this;
    const { data = [], className, style } = this.props

    return (
      <div
        className={classnames('sl-wrap', className)}
        style={Object.assign({
          overflowY: 'scroll',
          position: 'relative',
        }, style)}
        ref={$wrap => this.$wrap = $wrap}
      >
        {data.map(({ header, items, key }, index) => (
          <div
            className="sl-group"
            key={key !== undefined ? key : index}
            ref={$group => {
              $groupMap[index] = $group;
            }}
          >
            <div
              className="sl-header"
              style={{
                width: '100%',
              }}
            >{header}</div>
            <div
              className="sl-items"
              ref={$items => {
                if (index === 0) {
                  this.$firstItem = $items;
                }
              }}
            >{items}</div>
          </div>
        ))}
      </div>
    )
  }
}
