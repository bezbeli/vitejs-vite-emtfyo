import React from 'react';
import ReactDOM from 'react-dom';
import { ContentAuthProvider } from '@contentauth/react-hooks';
import wasmSrc from '@contentauth/sdk/dist/assets/wasm/toolkit_bg.wasm?url';
import workerSrc from '@contentauth/sdk/dist/cai-sdk.worker.min.js?url';
import './index.css';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <ContentAuthProvider config={{ wasmSrc, workerSrc }}>
      <App />
    </ContentAuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
