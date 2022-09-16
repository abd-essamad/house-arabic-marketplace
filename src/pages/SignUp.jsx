import { useState } from "react"
import { useNavigate,useLocation } from "react-router-dom"
import {getAuth, createUserWithEmailAndPassword, updateProfile}
from 'firebase/auth'
import {toast} from 'react-toastify'
import Spinner from "../components/spinner/Spinner"
import {db} from '../firebase.config'
import { setDoc,doc , serverTimestamp } from "firebase/firestore"
import './pages.css'

function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading,setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const {name,email, password} = formData
  const navigate = useNavigate()
  const location = useLocation()
  
  const onSubmit = async(e)=>{
    setLoading(true)
     e.preventDefault()
     try {
        const auth = getAuth()
        const userCredential = await createUserWithEmailAndPassword(
          auth, email, password
        )
        const user = userCredential.user
        updateProfile(auth.currentUser, {
          displayName: name
        })
        const formDataCopy = {...formData}
        delete formDataCopy.password
        formDataCopy.timestamp = serverTimestamp()

        await setDoc(doc(db,'users',user.uid),formDataCopy)
        navigate('/')
        setLoading(false)
        toast.success('تم انشاء حساب جديد')
     } catch (error) {
        toast.error('المعلومات غير صحيحة')
        setLoading(false)
     }
  }
   
  const onChange = (e)=>{
    setFormData((prevState)=>({
       ...prevState,
       [e.target.id]: e.target.value
    }))
  }
  return (
    <div className="signin">
      <div className="container" style={{padding: location.pathname ==='/sign-up' && '2rem 3rem'}}>
        <h1 style={{marginBottom: location.pathname === '/sign-up' && '4rem' }}>انشاء حساب جديد</h1>
        {loading ? <Spinner/> : ''}
        <div  className="form">
          <form onSubmit={onSubmit}>
            <input type="text" id="name" value={name} onChange={onChange} placeholder="الاسم الكامل" />
            <input type="text" id="email" value={email} onChange={onChange}  placeholder="البريد الألكتروني" />
            <input type="password" id="password" value={password} onChange={onChange} placeholder="كلمة المرور"/>
            <button type="submit">أنشئ حساب جديد</button>
          </form>
        </div>
        <p style={{marginTop: location.pathname === '/sign-up' && '2rem' }}> لديك حساب مسبقا سجل الدخول من <span className="text-blue" onClick={()=>navigate('/sign-in')} >هنا</span> <a></a></p>
        </div >
    </div>
  )
}

export default SignUp
