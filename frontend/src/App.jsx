import React, { useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom';
import MainBody from './components/MainBody';
import Header from './components/Header';
import Login from './components/Login';
import SignUp from './components/SignUp';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductDetails from './pages/ProductDetails';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetails';
import Cart from './pages/Cart';
import Buy from './pages/Buy';
import ProductCategories from './components/ProductCategories';
import TopFeaturedProduct from './components/TopFeaturedProduct';
import Shop from './pages/Shop';
import FeaturedIn from './components/FeaturedIn';
import Trending from './pages/Trending';
import BuyingDetails from './pages/BuyingDetails';
import MyOrder from './pages/MyOrder';
import Footer from './components/Footer';
import About from './pages/About';
import PaymentPolicy from './pages/PaymentPolicy';
import HelpPage from './pages/Help';
import SecurityPolicy from './pages/SecurityPolicy';
import Support from './pages/Support';


const App = () => {

  const location = useLocation();

  const hideHeader = ["/login", "/signup", "/details", "/about", '/paymentpolicy','/securitypolicy'].includes(location.pathname);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const isMobile = windowWidth < 600;


  return (
    <div className={`overflow-x-hidden`}>
      {!hideHeader && <Header isMobile={isMobile} />}
      <Routes>
        <Route path="/" element={
          <>
            <MainBody isMobile={isMobile} />
            <ProductCategories />
            <TopFeaturedProduct/>
            <FeaturedIn/>
            <Footer/>
          </>
        }
        />
        <Route path="/products/:category" element={<ProductList />} />
        <Route path="/products/:category/:id" element={<ProductDetail />} />
        <Route path='/shop' element={<Shop/>}/>
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/cart" element={<Cart isMobile={isMobile} />} />
        <Route path="/buy" element={<Buy />} />
        <Route path="/trending" element={<Trending/>}/>
        <Route path='/details' element={<BuyingDetails/>}/>
        <Route path='/order' element={<MyOrder/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/paymentpolicy' element={<PaymentPolicy/>}/>
        <Route path='/help' element={<HelpPage/>}/>
        <Route path='/securitypolicy' element={<SecurityPolicy/>}/>
        <Route path='/support' element={<Support/>}/>
      </Routes>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>

  )
}

export default App