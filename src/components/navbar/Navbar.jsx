import { useState,useEffect} from "react"
import { getAuth } from "firebase/auth"
import { useNavigate, useLocation } from "react-router-dom"
import {HomeIcon,AboutIcon,UserIcon,LockedIcon,MessageIcon,MenuIcon,LogoutIcon} from "./imports"
import './navbar.css'
function Navbar() {
  const auth = getAuth()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(()=>{
    setUser(auth.currentUser)
    setLoading(false)
  },)

  const navigate = useNavigate()
  const [menuActive,setMenuActive] = useState(false)
  const location = useLocation()
  const pathMatchRoute =(route)=>{
   if(route  === location.pathname){
      return true
   }
  }
  const toggleMenu = ()=>{ 
    setMenuActive((prevState)=>!prevState)
  }
  const onLogout = ()=>{
    auth.signOut()
    setUser(null)
    navigate('/')
  }

  return (
    <nav className="navbar">
      
        <div className="auth-nav">
          {user && !loading ? 
            <ul>
            <li onClick={onLogout}><LogoutIcon fill="#ff3847" className="icon logout"  />تسجيل الخروج </li>
            <li onClick={()=>navigate('/profile')}>{user.displayName}<UserIcon fill="#7ed957" className="icon" /></li>
            </ul>
          :
            <ul>
            <li style={{opacity: pathMatchRoute('/sign-up') && 1 }} onClick={()=>navigate('/sign-up')} ><a>اشتراك</a> <LockedIcon fill="#fff" className="icon" /></li>
            <li style={{opacity: pathMatchRoute('/sign-in') && 1 }} onClick={()=>navigate('/sign-in')} ><a>تسجيل الدخول</a> <UserIcon fill="#fff" className="icon" /></li>
            </ul>
            }
        </div>

        <div className="nav">
            <ul>
            <li style={{opacity: pathMatchRoute('/contact-us') && 1  }} onClick={()=>navigate('/contact-us')} ><a>اتصل بنا</a> <MessageIcon fill="#fff" className="icon" /></li>
            <li style={{opacity: pathMatchRoute('/about') && 1  }} onClick={()=>navigate('/about')} ><a >حول الموقع</a> <AboutIcon fill="#fff" className="icon" /></li>
            <li style={{opacity: pathMatchRoute('/') && 1  }} onClick={()=>navigate('/')} ><a >الرِئيسية</a> <HomeIcon fill="#fff" className="icon" /></li>
            <li className="logo" onClick={()=>navigate('/')} ><a>عقار</a></li>
               
                
                
            </ul>
        </div>
        {/* NAVBAR MENU */}
        <div className={`menu ${menuActive ? 'active' : ''}`}>
        <div className='nav-menu' onClick={()=>toggleMenu()} >
          <p><MenuIcon fill="#fff" className="iconMenu" /></p>
         {user ?
          <ul>
          <li onClick={()=>navigate('/profile')}>{user.displayName}<UserIcon fill="#7ed957" className="icon" /></li>
          <li style={{opacity: pathMatchRoute('/') && 1  }} onClick={()=>navigate('/')} ><a >الرِئيسية</a> <HomeIcon fill="#fff" className="icon" /></li>
          <li style={{opacity: pathMatchRoute('/contact-us') && 1  }} onClick={()=>navigate('/contact-us')} ><a>اتصل بنا</a> <MessageIcon fill="#fff" className="icon" /></li>
          <li style={{opacity: pathMatchRoute('/about') && 1  }} onClick={()=>navigate('/about')} ><a >حول الموقع</a> <AboutIcon fill="#fff" className="icon" /></li>
          <li onClick={onLogout}>تسجيل الخروج<LogoutIcon fill="#ff3847" className="icon logout"/></li>
          </ul>
          :
          <ul>
          <li style={{opacity: pathMatchRoute('/sign-up') && 1 }} onClick={()=>navigate('/sign-up')} ><a>اشتراك</a> <LockedIcon fill="#fff" className="icon" /></li>
          <li style={{opacity: pathMatchRoute('/sign-in') && 1 }} onClick={()=>navigate('/sign-in')} ><a>تسجيل الدخول</a> <UserIcon fill="#fff" className="icon" /></li>
          <li style={{opacity: pathMatchRoute('/') && 1  }} onClick={()=>navigate('/')} ><a >الرِئيسية</a> <HomeIcon fill="#fff" className="icon" /></li>
          <li style={{opacity: pathMatchRoute('/contact-us') && 1  }} onClick={()=>navigate('/contact-us')} ><a>اتصل بنا</a> <MessageIcon fill="#fff" className="icon" /></li>
          <li style={{opacity: pathMatchRoute('/about') && 1  }} onClick={()=>navigate('/about')} ><a >حول الموقع</a> <AboutIcon fill="#fff" className="icon" /></li>
          </ul>
          }
         <div className="triangle"></div>
        </div>
        <div className="logo-menu">
        <p className="logo" onClick={()=>navigate('/')}  >عقار</p>
        </div>
        </div>
    </nav>
  )
}

export default Navbar
