import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Group from './Group';

/**
 * StickyList - react sticky header listview
 *
 * HTML struts:
 *
 * .sl-wrap
 *    .sl-group
 *        .sl-header
 *        .sl-items
 *            .sl-item
 *            .sl-item
 *            ...
 *    .sl-group
 *        .sl-header
 *        .sl-items
 *            .sl-item
 *            .sl-item
 *            ...
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
       * data for a group of items
       */
      items: PropTypes.arrayOf(PropTypes.shape({
        /**
         * key for this group, for improve performance
         */
        key: PropTypes.any,
        /**
         * display for a item in group
         */
        display: PropTypes.any,
      })),
    })),
  }

  groupMap = {};
  stickyIndex = 0;
  lastWrapScrollTop = 0;

  componentDidMount() {
    this.listenScroll();
  }

  componentWillUnmount() {
    this.unlistenScroll();
  }

  componentWillReceiveProps(nextProps) {
    const { data } = this.props;
    if (data !== nextProps.data) {
      this.groupMap = {};
      this.stickyIndex = 0;
    }
  }

  componentWillUpdate() {
    this.unlistenScroll();
  }

  componentDidUpdate() {
    this.listenScroll();
  }

  listenScroll = () => {
    this.$wrap.onscroll = this.onScroll;
  }

  unlistenScroll = () => {
    this.$wrap.onscroll = null;
  }

  onScroll = () => {
    const { groupMap, stickyIndex, lastWrapScrollTop } = this;
    const stickyGroup = this.groupMap[this.stickyIndex];

    const wrapScrollTop = this.$wrap.scrollTop;
    // scroll up or down, true is down false is up
    const goDown = wrapScrollTop - lastWrapScrollTop > 0;
    this.lastWrapScrollTop = wrapScrollTop;
    const checkIndex = goDown ? stickyIndex + 1 : stickyIndex - 1;
    const nextGroup = groupMap[checkIndex];

    if (nextGroup) {
      const { $group, $header } = nextGroup;
      const { offsetTop: groupOffsetTop } = $group;

      const updateToNextSticky = () => {
        Object.assign($header.style, {
          position: 'absolute',
          top: `${wrapScrollTop}px`,
        })

        if (stickyGroup && stickyGroup !== nextGroup) {
          Object.assign(stickyGroup.$header.style, {
            position: '',
            top: '',
          })
        }
        this.stickyIndex = checkIndex;
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
    Object.assign(stickyGroup.$header.style, {
      position: 'absolute',
      top: `${wrapScrollTop}px`,
    });
  }

  render() {
    const { groupMap } = this;
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
          <Group
            key={key !== undefined ? key : index}
            header={header}
            items={items}
            ref={group => {
              groupMap[index] = group;
            }}
          />
        ))}
      </div>
    )
  }
}
