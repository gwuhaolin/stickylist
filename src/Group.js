import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

/**
 * a Group means a Header with some items in list
 */
export default class Group extends PureComponent {

  static propTypes = {
    /**
     * header display for a group of items
     */
    header: PropTypes.any,
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
  }

  // sl-group ele
  $group;

  // sl-header ele
  $header;

  render() {
    const { header, items = [] } = this.props
    return (
      <div
        className="sl-group"
        ref={$group => this.$group = $group}
      >
        <div
          className="sl-header"
          style={{
            width: '100%',
          }}
          ref={($header) => {
            this.$header = $header;
          }}
        >{header}</div>
        <div className="sl-items">
          {items.map(({ key, display }, index) =>
            <div
              className="sl-item"
              key={key !== undefined ? key : index}
            >{display}</div>
          )}
        </div>
      </div>

    )
  }
}
