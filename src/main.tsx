import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./redux/store";
import App from "./App";
import "./index.css";
import { GOOGLE_CLIENT_ID } from "@/common/configuratoins";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
const stripePromise = loadStripe(
  "pk_test_51PHmWaSCFxhihy8IolYTxCsIFbRNHGc2byVYCqYRLo1aFs1XzXRnZ32zsE7fevPERYFgskgZvJME9IIBDQryioFp00F3kHHaTy"
);



ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId={`${GOOGLE_CLIENT_ID}`}>
        <Elements stripe={stripePromise}>
          <App />
          <Toaster  position="top-right" />
        </Elements>
      </GoogleOAuthProvider>
    </Provider>
  </React.StrictMode>
);
