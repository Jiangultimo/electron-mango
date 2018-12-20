import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import routerConfig from '@/routerConfig';
import '@/index.css'
import * as serviceWorker from '@/serviceWorker';
console.log(routerConfig)

ReactDOM.render(
  <BrowserRouter>
    {renderRoutes(routerConfig)}
  </BrowserRouter>,
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
