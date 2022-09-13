import {getAuth} from 'firebase/auth'
import { useState } from 'react'
function Profile() {
  const auth = getAuth()
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  })
  
  return (
    <>
     
    </>
  )
}

export default Profile
