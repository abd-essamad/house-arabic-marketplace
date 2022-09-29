import {getAuth,updateProfile} from 'firebase/auth'
import { useState, useEffect } from 'react'
import {  Link,  } from 'react-router-dom'
import ListingItem from '../components/listings/ListingItem'
import {
  updateDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc
} from 'firebase/firestore'
import { db } from '../firebase.config'
import {toast} from 'react-toastify'
import {FaArrowLeft} from 'react-icons/fa'
function Profile() {
  const [listings,setListings] = useState(null)
  const [loading, setLoading] = useState(true)
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
  const onDelete = async(listingId)=>{
   if(window.confirm('هل أنت متأكد ؟')){
    await deleteDoc(doc(db,'listings',listingId))
    const updateLisitngs = listings.filter((listing)=>
      listing.id !== listingId)
      setListings(updateLisitngs)
      toast.success('تم حدف العنصر بنجاح')
   }
  }
  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, 'listings')

      const q = query(
        listingsRef,
        where('userRef', '==', auth.currentUser.uid),
        orderBy('timestamp', 'desc')
      )

      const querySnap = await getDocs(q)

      let listings = []

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        })
      })

      setListings(listings)
      setLoading(false)
    }

    fetchUserListings()
  }, [auth.currentUser.uid])
  return (
    <div className='above'>
      <div className="left">
         {!loading && listings?.length > 0 && 
         (
          <>
          <ul className='home__header house offers profile '>
                {listings.map((listing)=>(
                  <ListingItem key={listing.id} listing={listing.data} id={listing.id}
                  onDelete={()=>onDelete(listing.id)} />
                ))}
          </ul>
          </>
          
        )}
      
      </div>
      <div className="right">
       <div className='profile'>
        <div className="profile__header">
          <p className='title'>!عزيزي {name} مرحبا بك في حسابك </p>
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
        </div>
        
      </div>
  )
}

export default Profile
