function genItems(size) {
  const items = [];
  for (let i = 0; i < size; i++) {
    items.push({
      key: i,
      display: `item${i}`
    })
  }
  return items;
}

export function genData(dataSize) {
  const data = [];
  for (let i = 0; i < dataSize; i++) {
    data.push({
      key: i,
      header: `header${i}`,
      items: genItems(10)
    })
  }
  return data;
}



