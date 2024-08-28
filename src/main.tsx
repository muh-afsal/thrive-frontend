import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';
import './index.css';
import {GOOGLE_CLIENT_ID} from "@/common/configuratoins"
import { GoogleOAuthProvider} from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
    <GoogleOAuthProvider clientId={`${GOOGLE_CLIENT_ID}`}>
      <App />
      </GoogleOAuthProvider>
    </Provider>
  </React.StrictMode>
);
