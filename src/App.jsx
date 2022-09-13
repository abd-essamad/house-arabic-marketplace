import { BrowserRouter as Router, Routes , Route } from "react-router-dom";
import Home from './pages/Home'
import Navbar from "./components/navbar/Navbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Profile from './pages/Profile'
import Offers from './pages/Offers'
import About from "./pages/About";
import Contact from "./pages/Contact";
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import ForgotPassword from './pages/ForgotPassword'

function App() {
  return (
    <>
      <Router>
        <Navbar/>
        <Routes>
          <Route  path='/'  element={<Home/>}  />
          <Route  path='/offers'  element={<Offers/>}  />
          <Route  path='/sign-in'  element={<SignIn/>}  />
          <Route  path='/profile'  element={<Profile/>}  />
          <Route  path='/sign-up'  element={<SignUp/>}  />
          <Route  path='/forgot-password'  element={<ForgotPassword/>}  />
          <Route  path='/about'  element={<About/>}  />
          <Route  path='/contact-us'  element={<Contact/>}  />
        </Routes>
      </Router>
      <ToastContainer autoClose ={1000} />
    </>
  );
}

export default App;
