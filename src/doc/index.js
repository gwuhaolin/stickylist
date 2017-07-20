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
    key: 'A',
    items: <ul>
      <li>1</li>
      <li>2</li>
    </ul>
  }
]

<StickyList data={DATA}/>
`

const len = 40;
const data = genData(len);
let stickyList
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
      ref={c => stickyList = c}
      data={data}
    />
    <button
      title="random scroll to index group"
      onClick={() => {
        stickyList.scrollTo(parseInt(Math.random() * len));
      }}>scrollTo
    </button>
  </Redemo>
)

render(demo, window.document.getElementById('app'));

// HMR
if (process.env.NODE_ENV !== 'production') {
  if (module.hot) {
    module.hot.accept();
  }
}
