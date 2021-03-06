[![Npm Package](https://img.shields.io/npm/v/stickylist.svg?style=flat-square)](https://www.npmjs.com/package/stickylist)
[![Npm Downloads](http://img.shields.io/npm/dm/stickylist.svg?style=flat-square)](https://www.npmjs.com/package/stickylist)
[![Dependency Status](https://david-dm.org/gwuhaolin/stickylist.svg?style=flat-square)](https://npmjs.org/package/stickylist)

# StickyList
<p align="center">
  <a href="https://gwuhaolin.github.io/redemo/">
    <img alt="redemo" src="./stickylist.gif" width="400">
  </a>
</p>

React sticky header listview component

- easy to use
- high performance
- scalable and custom styles

## Use
1. Install by `npm i stickylist`
2. Provide data, StickyList will render it:
```js
import StickyList from 'stickylist';

const DATA = [
  {
    header: 'ListA',
    key: 'A',
    items: <ul>
      <li>1</li>
      <li>2</li>
    </ul>
  },
  ...
]

<StickyList data={DATA}/>
```

Notice that `key` in data is for improve performance, if not provide will use index as key.

3. instance method `scrollTo(index)` can used to control StickyList scroll to a group by group index. e.g scroll to top(0) and bottom(data.length-1)

See a [live demo](https://gwuhaolin.github.io/stickylist/) and it's [source code](https://github.com/gwuhaolin/stickylist/blob/master/src/doc/index.js).

### Custom styles
StickyList's HTML struts in className:
```
.sl-wrap
   .sl-group
       .sl-header
       .sl-items
   .sl-group
       .sl-header
       .sl-items
   ...
```
You can add style to these className to custom styles, e.g:
```css
.sl-wrap{
  height: 100px;
}
.sl-header {
  background-color: #ddd;
  box-sizing: border-box;
  padding: 5px;
}
.sl-item {
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
  padding: 5px;
}
```
