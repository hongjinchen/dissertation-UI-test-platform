import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './App';
// import Dashboard from './pages/GroupSpace';
import reportWebVitals from './reportWebVitals';
import AppRoutes from './routes';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>
);

// 通过ReactDOM.createRoot()创建一个根节点，然后调用render()方法渲染组件
reportWebVitals();
