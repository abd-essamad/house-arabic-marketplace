import {getAuth,updateProfile} from 'firebase/auth'
import { useState } from 'react'
import {  Link,  } from 'react-router-dom'
import { updateDoc,doc } from 'firebase/firestore'
import { db } from '../firebase.config'
import {toast} from 'react-toastify'
import {FaArrowLeft} from 'react-icons/fa'
function Profile() {
  const auth = getAuth()
  const [changeDetails, setChangeDetails] = useState(false)
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  })
  const {email, name} = formData
  const onSubmit = async()=>{
    try {
      if(auth.currentUser.displayName !== name){
        //update display Name
        await updateProfile(auth.currentUser,{
          displayName: name
        })
        //update in firestore
        const userRef = doc(db,'users',auth.currentUser.uid)
        await updateDoc(userRef,{
          name
        })
        
      }
      toast.success('تم تحديث المعلومات بنجاح')
    } catch (error) {
      toast.error('فشلت العملية المرجو المحاولة من جديد')
    }
  }
  const onChange = (e)=>{
    setFormData((prevState)=>({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }
  return (
      <div className='profile'>
        <div className="profile__header">
          <p>!عزيزي {name} مرحبا بك في حسابك </p>
        </div>
        <div className="profile__body">
          <p>المعلومات الشخصية</p>
          <form >
               <input type="text" id="name" disabled={!changeDetails} onChange={onChange} value={name} />
               <input type="text" id="email" disabled={!changeDetails} onChange={onChange} value={email} />
               <p className="change" onClick={()=> {changeDetails && onSubmit()
                     setChangeDetails((prevState)=>!prevState)
              } }>
                {changeDetails ? 'موافق ':
                      ' تحديث المعلومات'
                    }
                </p>
          </form>
          <Link className="link" to='/create-listing'> <FaArrowLeft className='ic'/>لديك عقار للبيع أو للكراء من هنا </Link>
        </div>
        
      </div>
    
    
  )
}

export default Profile
