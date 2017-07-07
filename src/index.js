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

  static defaultProps = {
    data: [],
  }

  groupMap = {};
  stickyIndex;

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
      this.stickyIndex = null;
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
    const { groupMap } = this;
    // update current header positions and apply fixed positions to the top one
    const wrapScrollTop = this.$wrap.scrollTop;
    let sum = 0;
    for (const index in groupMap) {
      const group = groupMap[index];
      const { $group, $header } = group;
      sum += $group.clientHeight;
      if (sum > wrapScrollTop) {
        $header.style.position = 'absolute';
        $header.style.top = `${wrapScrollTop}px`;
        const stickyGroup = this.groupMap[this.stickyIndex];
        if (stickyGroup && stickyGroup !== group) {
          stickyGroup.$header.style.position = '';
        }
        this.stickyIndex = index;
        return;
      }
    }
  }

  render() {
    const { groupMap } = this;
    const { data, className, style } = this.props

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
