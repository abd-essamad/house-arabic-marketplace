import { BrowserRouter as Router, Routes , Route } from "react-router-dom";
import Home from './pages/Home'
import Navbar from "./components/navbar/Navbar";
import { ToastContainer} from 'react-toastify';
import TopNav from "./components/navbar/TopNav";
import 'react-toastify/dist/ReactToastify.css';
import Profile from './pages/Profile'
import PrivateRoute from "./components/PrivateRoute";
import Offers from './pages/Offers'
import Category from "./pages/Category";
import CreateListing from "./pages/CreateListing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import ForgotPassword from './pages/ForgotPassword'

function App() {
  return (
    <>
      <Router>
        <TopNav/>
        <Navbar/>
        <Routes>
          <Route  path='/'  element={<Home/>}  />
          <Route  path='/offers'  element={<Offers/>}  />
          <Route  path='/sign-in'  element={<SignIn/>}  />
          <Route  path='/profile'  element={<PrivateRoute/>}>
          <Route  path='/profile'  element={<Profile/>}  />
          </Route>
          <Route  path='/sign-up'  element={<SignUp/>}  />
          <Route  path='/category/:categoryName'  element={<Category/>}  />
          <Route  path='/forgot-password'  element={<ForgotPassword/>}  />
          <Route  path='/create-listing'  element={<CreateListing/>}  />
          <Route  path='/about'  element={<About/>}  />
          <Route  path='/contact-us'  element={<Contact/>}  />
        </Routes>
      </Router>
      <ToastContainer autoClose ={1000} />
    </>
  );
}

export default App;
