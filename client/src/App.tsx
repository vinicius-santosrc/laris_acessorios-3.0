import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/geral/header/Header';
import Home from './pages/main/home/Home';
import { Provider } from './components/ui/provider';
import Collections from './pages/collections/Collections';
import ProductPage from './pages/product/Product';
import { Toaster } from './components/ui/toaster';
import CheckoutPage from './pages/checkout/CheckoutPage';

function App( Component: any, pageProps: any ) {
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
            <Route path='/checkout' element={<CheckoutPage />}></Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
