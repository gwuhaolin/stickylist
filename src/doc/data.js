import * as React from 'react';

function genItems(size) {
  const items = [];
  for (let i = 1; i <= size; i++) {
    items.push(<div className="sl-item" key={i}>{`item${i}`}</div>);
  }
  return items;
}

export function genData(dataSize) {
  const data = [];
  for (let i = 1; i <= dataSize; i++) {
    data.push({
      key: i,
      header: `header${i}`,
      items: genItems(10)
    })
  }
  data.unshift({
    key: 'logo',
    header: `React sticky header component`,
    items: <div>
      <h1 style={{ textAlign: 'center' }}>StickyList</h1>
    </div>
  })
  return data;
}



