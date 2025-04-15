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
import Institutional from './pages/institutional/Institutional';
import { PolicyPrivacyData } from './pages/institutional/policy-privacy-data/PolicyPrivacyData';
import Footer from './components/geral/footer/Footer';
import { BeCarefulJewerlys } from './pages/institutional/becarefuljewerlys/BeCarefulJewerlys';
import { Questions } from './pages/institutional/questions/Questions';
import { BeaModelPage } from './pages/institutional/beamodel/BeAModel';
import { ContactUs } from './pages/institutional/contact-us/ContactUs';
import { NotFoundPage } from './pages/404/404';
import authService from './services/authService';
import { Dashboard } from './components/admin/Dashboard';
import { ProductsAdminPage } from './pages/admin/ProductsAdminPage';
import { UsersAdmin } from './pages/admin/UsersAdmin';
import { Planing } from './pages/admin/Planning';
import { SheetsPage } from './pages/admin/SheetsPage';
import { ProductEditPage } from './pages/admin/ProductEditPage';
import { ProductAddPage } from './pages/admin/ProductAddPage';
import { FacilitysPage } from './pages/admin/Facilitys';
import AccountOrders from './pages/account/AccountOrders';
import Orders from './pages/admin/Orders';
import Reports from './pages/admin/Reports';
import Config from './pages/admin/Config';
import CategoriesAdmin from './pages/admin/CategoriesAdmin';
import { UserProvider } from './contexts/UserContext';
import AdminOrders from './pages/admin/AdminOrders';

const url = process.env.REACT_APP_API_ENDPOINT;

const routes = [
  { path: '/', element: <Home /> },
  { path: '/collections/:collection_name', element: <Collections /> },
  { path: '/product/:product_url', element: <ProductPage /> },
  { path: '/success/:uid', element: <Success /> },
  { path: '/account', element: <Account /> },
  { path: '/account/orders/:order', element: <AccountOrders /> },
  { path: '/search/:search', element: <SearchPage /> },
  { path: '/admin', isProtected: true, element: <AdminPage><Dashboard /></AdminPage> },
  { path: '/admin/products', isProtected: true, element: (<AdminPage><ProductsAdminPage /></AdminPage>) },
  { path: '/admin/products/add', isProtected: true, element: (<AdminPage><ProductAddPage /></AdminPage>) },
  { path: '/admin/products/:uid', isProtected: true, element: (<AdminPage><ProductEditPage /></AdminPage>) },
  { path: '/admin/clients', isProtected: true, element: (<AdminPage><UsersAdmin /></AdminPage>) },
  { path: '/admin/orders', isProtected: true, element: (<AdminPage><Orders /></AdminPage>) },
  { path: '/admin/orders/:order', isProtected: true, element: (<AdminPage><AdminOrders /></AdminPage>) },
  { path: '/admin/planning', isProtected: true, element: (<AdminPage><Planing /></AdminPage>) },
  { path: '/admin/facilitys', isProtected: true, element: (<AdminPage><FacilitysPage /></AdminPage>) },
  { path: '/admin/reports', isProtected: true, element: (<AdminPage><Reports /></AdminPage>) },
  { path: '/admin/config', isProtected: true, element: (<AdminPage><Config /></AdminPage>) },
  { path: '/admin/categories', isProtected: true, element: (<AdminPage><CategoriesAdmin /></AdminPage>) },
  { path: '/admin/sheet/:planilha', isProtected: true, element: (<AdminPage><SheetsPage /></AdminPage>) },
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(`${url}/config`);
        if (!response.ok) throw new Error("Failed to fetch config");
        const { publishableKey } = await response.json();
        setStripePromise(loadStripe(publishableKey));
      } catch (error: any) {
        throw Error("Error fetching config:", error);
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
            'Authorization': `Bearer ${process.env.REACT_APP_DEFAULTCONFIGURATION == "production" ? process.env.REACT_APP_STRIPE_SECRET_KEY_PRODUCTION : process.env.REACT_APP_STRIPE_SECRET_KEY}`, //USE REACT_APP_STRIPE_SECRET_KEY_PRODUCTION para producao
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) throw new Error("Failed to create payment intent");
        const { clientSecret } = await response.json();
        setClientSecret(clientSecret);
      } catch (error: any) {
        throw error;
      }
    };

    createPaymentIntent();
  }, []);

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const authentication = await authService.getUserData();
      if (authentication) {
        const isAdmin = await authService.isUserAdmin(authentication.email);
        setIsAuthenticated(isAdmin);
      }
      else {
        setIsAuthenticated(false)
      }
    };

    checkUserLoggedIn();
  }, []);

  const ProtectedRoute = ({ element }: any) => {
    if (!isAuthenticated) {
      return <Loader />;
    }

    return isAuthenticated ? element : <Navigate to="/404" />;
  };
  return (
    <div className="page">
      <Provider>
        <Toaster />
        <UserProvider>
          <BrowserRouter>
            <Header />
            <Routes>
              {routes.map((route, index) => {
                if (route.isProtected) {
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
                    paymentMethodTypes: ['card'],
                    appearance: { variables: { colorPrimaryText: '#be0a45', colorDanger: "#be0a45" } }, mode: "payment", amount: 1 * 100, currency: 'brl',
                  }}>
                    <CheckoutPage paymentMethodTypes={['card']} clientSecret={clientSecret} />
                  </Elements>
                ) : (
                  <Loader />
                )}
              />

              <Route path="*" element={<Navigate to="/404" />} />
            </Routes>
          </BrowserRouter>
        </UserProvider>
        {/* <PolicyCookies /> */}
      </Provider>
    </div>
  );
}

export default App;