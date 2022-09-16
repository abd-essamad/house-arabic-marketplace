import { useState } from "react"
import { useNavigate } from "react-router-dom"
import './pages.css'
import {toast} from 'react-toastify'
import Spinner from "../components/spinner/Spinner"
import { getAuth,signInWithEmailAndPassword } from "firebase/auth"
function SignIn() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading,setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const {email, password} = formData
  const navigate = useNavigate()
  const onChange = (e)=>{
    e.preventDefault()
    setFormData((prevState)=>({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }
  const onSubmit = async(e)=>{
      setLoading(true)
      e.preventDefault()
      try {
        const auth = getAuth()

      const userCredential = await signInWithEmailAndPassword(
        auth,email,password
      )
      if(userCredential.user){
        navigate('/profile')
        setLoading(false)
        toast.success('تم تسجيل الدخول بنجاح')
      }
      } catch (error) {
        toast.error('المعلومات غير صحيحة')
        setLoading(false)
        
      }
    
    
  }
  return (
    <div className="signin">
      <div className="container">
        <h1>تسجيل الدخول</h1>
        {loading ? <Spinner/> : ''}
        <div className="form">
          <form onSubmit={onSubmit}>
            <input type="text" id="email" value={email} onChange={onChange} placeholder="البريد الألكتروني" />
            <input type="password" id="password" value={password} onChange={onChange} placeholder="كلمة المرور"/>
            <button type="submit">تسجيل الدخول</button>
          </form>
        </div>
        <p> ليس لديك حساب؟ أنشئ حساب من <span className="text-blue" onClick={()=>navigate('/sign-up')} >هنا</span></p>
        <p><span className="text-blue" onClick={()=>navigate('/forgot-password')} >نسيت كلمة المرور؟</span></p>
        </div>
    </div>
  )
}

export default SignIn
