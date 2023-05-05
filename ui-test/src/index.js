import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import theme from './theme';

import reportWebVitals from './reportWebVitals';
import AppRoutes from './routes';
// 导入ThemeProvider
import { ThemeProvider } from '@material-ui/core/styles';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <ThemeProvider theme={theme}>
    <AppRoutes />     
      </ThemeProvider>
  </React.StrictMode>
);

// 通过ReactDOM.createRoot()创建一个根节点，然后调用render()方法渲染组件
reportWebVitals();
