import { Link,Navigate,useNavigate } from "react-router-dom"
import {getAuth, sendPasswordResetEmail} from 'firebase/auth'
import { useState } from "react"
import {toast} from 'react-toastify'
function ForgotPassword() {
 const [email, setEmail] = useState('')
 const navigate = useNavigate()
  const onSubmit = async(e)=>{
    e.preventDefault()
    try {
      const auth = getAuth()
      await sendPasswordResetEmail(auth,email)
      toast.success('تم ارسال الرابط بنجاج')
      
    } catch (error) {
      toast.error('فشلت عملية الارسال')
    }
  }
  const onChange = (e)=>{
    setEmail(e.target.value)
  }
  return (
    <div className="profile">
      <div className="profile__header">
          <p><span>نسيت كلمة المرور؟</span></p>
        </div>
        <div className="profile__body password">
          <p className="text-password ">استرداد كلمة المرور</p>
          <form >
               <input type="text"  onChange={onChange} placeholder='البريد الالكتروني' />
               <div className="forget">
               <p className="text-pass blue" onClick={onSubmit}>أرسل رابط الاسترداد</p>
               <p className="sign-in" onClick={()=>navigate('/sign-in')}>سجل الدخول </p>
               </div>
          </form>
          
        </div>
    </div>
  )
}

export default ForgotPassword
