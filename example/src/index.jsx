import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { HyperProvider } from '@infinium/hyper';

import './jupiterui.css';

ReactDOM.render(<HyperProvider config={{ prefix: 'http://localhost:3002', revalidateOnFocus: false }}><App /></HyperProvider>, document.getElementById('root'))
