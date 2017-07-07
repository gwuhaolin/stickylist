import React from 'react';
import { render } from 'react-dom';
import StickyList from '../index';
import Redemo from 'redemo';
import { genData } from './data';
import './index.css';

const docgen = require('!!docgen-loader!../index');

const doc = `
## react sticky header listview component
- easy to use
- high performance
- scalable and custom styles
`

const code = `
import StickyList from 'stickylist';

const DATA = [
  {
    header: 'ListA',
    key:'A',
    items: [
      { key:1, display: 'item1'},
      { key:2, display: 'item2'},
    ]
  }
]

<StickyList data={DATA}/>
`

const data = genData(20);
const demo = (
  <Redemo
    title="StickyList"
    docgen={docgen}
    doc={doc}
    code={code}
    codeVisible
    propTypeVisible
  >
    <StickyList
      data={data}
    />
  </Redemo>
)

render(demo, window.document.getElementById('app'));

// HMR
if (process.env.NODE_ENV !== 'production') {
  if (module.hot) {
    module.hot.accept();
  }
}
