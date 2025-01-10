import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
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
import Account from './pages/account/Account';
import { SearchPage } from './pages/search/Search';
import AdminPage from './pages/admin/AdminPage';
import AdminLogin from './pages/admin/auth/AdminAuth';
import Institutional from './pages/institutional/Institutional';
import { PolicyPrivacyData } from './pages/institutional/policy-privacy-data/PolicyPrivacyData';
import Footer from './components/geral/footer/Footer';
import { BeCarefulJewerlys } from './pages/institutional/becarefuljewerlys/BeCarefulJewerlys';
import { Questions } from './pages/institutional/questions/Questions';
import { BeaModelPage } from './pages/institutional/beamodel/BeAModel';
import { ContactUs } from './pages/institutional/contact-us/ContactUs';
import { NotFoundPage } from './pages/404/404';
import { CheckIfUserIsLogged } from './lib/firebase';

const url = process.env.REACT_APP_API_ENDPOINT;

const routes = [
  { path: '/', element: <Home /> },
  { path: '/collections/:collection_name', element: <Collections /> },
  { path: '/product/:product_url', element: <ProductPage /> },
  { path: '/success/:uid', element: <Success /> },
  { path: '/account', element: <Account /> },
  { path: '/search/:search', element: <SearchPage /> },
  { path: '/admin', element: <AdminPage /> },
  { path: '/admin/login', element: <AdminLogin /> },
  { path: '/contact-us', element: <Institutional><ContactUs /><Footer /></Institutional> },
  { path: '/tracking', element: <Institutional><Footer /></Institutional> },
  { path: '/care-for-jewelry', element: <Institutional><BeCarefulJewerlys /><Footer /></Institutional> },
  { path: '/questions', element: <Institutional><Questions /><Footer /></Institutional> },
  { path: '/policy', element: <Institutional><PolicyPrivacyData /><Footer /></Institutional> },
  { path: '/beamodel', element: <Institutional><BeaModelPage /><Footer /></Institutional> },
  { path: '/404', element: <NotFoundPage /> }
];

function App() {
  const [stripePromise, setStripePromise] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState<any>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

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
            'Authorization': `Bearer ${process.env.REACT_APP_STRIPE_SECRET_KEY_PRODUCTION}`,
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

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const authenticated = await CheckIfUserIsLogged();
      setIsAuthenticated(authenticated);
    };

    checkUserLoggedIn();
  }, []);

  const ProtectedRoute = ({ element }: any) => {
    if (isAuthenticated === null) {
      return <Loader />;
    }

    return isAuthenticated ? element : <Navigate to="/404" />;
  };
  return (
    <div className="page">
      <Provider>
        <Toaster />
        <BrowserRouter>
          <Header />
          <Routes>
            {routes.map((route, index) => {
              if (route.path === '/admin') {
                return (
                  <Route
                    key={index}
                    path={route.path}
                    element={<ProtectedRoute element={route.element} />}
                  />
                );
              }

              return <Route key={index} path={route.path} element={route.element} />;
            })}

            <Route
              path='/checkout'
              element={clientSecret && stripePromise ? (
                <Elements stripe={stripePromise} options={{
                  paymentMethodTypes: ['card', 'pix'], 
                  appearance: { variables: { colorPrimaryText: '#be0a45', colorDanger: "#be0a45" } }, mode: "payment", amount: 1 * 100, currency: 'brl',  }}>
                  <CheckoutPage paymentMethodTypes={['card', 'pix']} clientSecret={clientSecret} />
                </Elements>
              ) : (
                <Loader />
              )}
            />

            {/* Rota catch-all para 404 */}
            <Route path="*" element={<Navigate to="/404" />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;