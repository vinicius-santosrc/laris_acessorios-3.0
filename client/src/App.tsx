import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/geral/header/Header';
import Home from './pages/main/home/Home';
import { Provider } from './components/ui/provider';
import Collections from './pages/collections/Collections';
import ProductPage from './pages/product/Product';
import { Toaster } from './components/ui/toaster';
import CheckoutPage from './pages/checkout/CheckoutPage';
import { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Loader } from './components/ui/loader';
import Success from './pages/checkout/Sucess';

const url = process.env.REACT_APP_API_ENDPOINT;
function App() {
  const [stripePromise, setStripePromise] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState<any>("");

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(`${url}/config`);
        if (!response.ok) throw new Error("Failed to fetch config");
        const { publishableKey } = await response.json();
        setStripePromise(loadStripe(publishableKey));
      } catch (error) {
        console.error("Error fetching config:", error);
      }
    };

    fetchConfig();
  }, []);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await fetch(`${url}/create-payment-intent`, {
          method: "POST",
          body: JSON.stringify({ "item": 1 * 100 }),
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_STRIPE_SECRET_KEY}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) throw new Error("Failed to create payment intent");
        const { clientSecret } = await response.json();
        setClientSecret(clientSecret);
      } catch (error) {
        console.error("Error creating payment intent:", error);
      }
    };

    createPaymentIntent();
  }, []);

  return (
    <div className="page">
      <Provider>
        <Toaster />
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path='/' element={<Home />}></Route>
            <Route path='/collections/:collection_name' element={<Collections />}></Route>
            <Route path='/product/:product_url' element={<ProductPage />}></Route>
            <Route path='/checkout' element={clientSecret && stripePromise ? (
              <Elements stripe={stripePromise} options={{ mode: "payment", amount: 50 * 100, currency: 'brl', }}>
                <CheckoutPage clientSecret={clientSecret} />
              </Elements>
            ) : (
              <Loader />
            )}></Route>
            <Route path='/success' element={<Success />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;