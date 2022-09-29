import { useState, useEffect, useRef } from "react"
import { onAuthStateChanged, getAuth } from "firebase/auth"
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL

} from 'firebase/storage'
import { doc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import {db} from '../firebase.config'
import {v4 as uuidv4} from 'uuid'
import { useNavigate, useParams } from "react-router-dom"
import {FaArrowLeft} from 'react-icons/fa'
import Spinner from "../components/spinner/Spinner"
import { toast } from "react-toastify"
const EditListing = () => {
   // eslint-disable-next-line
  const [geolocationEnabled, setGeolocationEnabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [listing, setListing] = useState(false)
  const [formData, setFormData] = useState({
    type: 'rent',
    name: '',
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: '',
    surface:0,
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
    latitude: 0,
    longitude: 0,
  })

  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    offer,
    surface,
    regularPrice,
    discountedPrice,
    images,
    latitude,
    longitude,
  } = formData

  const auth = getAuth()
  const navigate = useNavigate()
  const params = useParams()
  const isMounted = useRef(true)

  // Redirect if listing is not user's
  useEffect(() => {
    if (listing && listing.userRef !== auth.currentUser.uid) {
      toast.error('ليست لديك صلاحيات للتعديل على هدا العرض')
      navigate('/')
    }
  })

  // Fetch listing to edit
  useEffect(() => {
    setLoading(true)
    const fetchListing = async () => {
      const docRef = doc(db, 'listings', params.listingId)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setListing(docSnap.data())
        setFormData({ ...docSnap.data(), address: docSnap.data().location })
        setLoading(false)
      } else {
        navigate('/')
        toast.error('العقار غير موجود')
      }
    }

    fetchListing()
  }, [params.listingId, navigate])

  // Sets userRef to logged in user
  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid })
        } else {
          navigate('/sign-in')
        }
      })
    }

    return () => {
      isMounted.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted])

  const onSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)

    if (discountedPrice >= regularPrice) {
      setLoading(false)
      toast.error('يجب أن يكون الثمن بعد التخفيض أصغر من الثمن الأصلي')
      return
    }

    if (images.length > 6) {
      setLoading(false)
      toast.error('Max 6 images')
      return
    }

    let geolocation = {}
    let location
    if(geolocationEnabled) {
        console.log('geolocation Enabled')
      }else {
       geolocation.lat = latitude
       geolocation.lng = longitude
       location = address
      }
     

    // Store image in firebase
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage()
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`

        const storageRef = ref(storage, 'images/' + fileName)

        const uploadTask = uploadBytesResumable(storageRef, image)

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            console.log('Upload is ' + progress + '% done')
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused')
                break
              case 'running':
                console.log('Upload is running')
                break
              default:
                break
            }
          },
          (error) => {
            reject(error)
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL)
            })
          }
        )
      })
    }

    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch(() => {
      setLoading(false)
      toast.error('Images not uploaded')
      return
    })

    const formDataCopy = {
      ...formData,
      imgUrls,
      geolocation,
      timestamp: serverTimestamp(),
    }

    formDataCopy.location = address
    delete formDataCopy.images
    delete formDataCopy.address
    !formDataCopy.offer && delete formDataCopy.discountedPrice

    // Update listing
    const docRef = doc(db, 'listings', params.listingId)
    await updateDoc(docRef, formDataCopy)
    setLoading(false)
    toast.success('تم التعديل بنجاح')
    navigate(`/category/${formDataCopy.type}/${docRef.id}`)
  }

  const onMutate = (e) => {
    let boolean = null

    if (e.target.value === 'true') {
      boolean = true
    }
    if (e.target.value === 'false') {
      boolean = false
    }

    // Files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }))
    }

    // Text/Booleans/Numbers
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }))
    }
  }
 if(loading) {
    return <Spinner/>
 }
  return (
    <div className='profile listing'>
        <div className="profile__header">
          <p>تعديل معلومات العقار الخاص بك</p>
        </div>
        <p className="pro-info">يمكنك تعديل المعلومات الخاصة بالعقار من هنا</p>
      <main className="info">
        <form onSubmit={onSubmit}>
        <div className="side">
            <div className="form-control">
            <div className="pro">
            <button type="submit"  className="primaryButton"><FaArrowLeft className="ic"/>اضافة العقار</button>
            </div>
            </div>
            </div>
        <div className="right">
           {offer && (
            <div className="form-control">
            <label>ثمن بعد التخفيض</label>
            <div className="button-bed">
            {type === 'rent' && <p>درهم / شهريا</p> }
            <input type="number" id="discountedPrice" min="50" max="7500000" value={discountedPrice} onChange={onMutate} required />
            </div>
            </div>
           )}

            <div className="form-control">
                <label>الصور<span className="small">(الصورة الأولى ستكون الغلاف )</span></label>
                <label htmlFor="images" className="addImages" >اضافة صور</label>
                <div className="button-form">
                <input type="file" style={{display:'none'}}  onChange={onMutate} id="images" max="6" accept=".png,.jpg,.jpeg" multiple  />
                </div>
            </div>
            <div className="form-control">
                <label >المساحة</label>
                <div className="button-bed">
                <p>متر مربع</p>
                <input type="number"  value={surface} onChange={onMutate} id="surface" required />
                </div>
            </div>
            {!geolocationEnabled && (
                 <div className="form-control">
                 <div className="button-bed">
                 <label>خط الطول</label>
                 <label>خط العرض</label>
                 </div>
                 <div className="button-bed">
                 <input type="number" id="latitude"  value={latitude} onChange={onMutate} min='1' max='50' required  />
                 <input type="number" id="longitude" value={longitude} onChange={onMutate} min='1' max='50'  required />
                 </div>
             </div>
            )}
            
            
        </div>
        <div className="center">
            <div className="form-control">
                <label>تتوفر على أثاث</label>
                <div className="button-form">
                <button type="button" onClick={onMutate} id="furnished" value={true} className={furnished ? 'formButtonActive': 'formButton'}>نعم</button>
                <button type="button" onClick={onMutate} id="furnished" value={false} className={!furnished && furnished!== null ? 'formButtonActive': 'formButton'}>لا</button>
                </div>
            </div>
            <div className="form-control">
                <label>عنوان العقار</label>
                <div className="button-form">
                    
                <textarea type="text" id="address" cols="20" rows="3" value={address} onChange={onMutate} required  ></textarea>
                </div>
            </div>
            
            <div className="form-control">
                <label>عرض خاص</label>
                <div className="button-form">
                <button type="button" onClick={onMutate} id="offer" value={true} className={offer ? 'formButtonActive': 'formButton'}>نعم</button>
                <button type="button" onClick={onMutate} id="offer" value={false} className={!offer && offer!== null ? 'formButtonActive': 'formButton'}>لا</button>
                </div>
            </div>
            <div className="form-control">
                <label>ثمن العقار</label>
                <div className="button-bed">
                {type === 'rent' && <p>درهم / شهريا</p> }
                <input type="number" id="regularPrice" min="50" max="7500000" value={regularPrice} onChange={onMutate} required />
                </div>
            </div>
        </div>
          
            <div className="left">
            <div className="form-control">
                <label>للبيع / للكراء</label>
                <div className="button-form">
                <button type="button" onClick={onMutate} id="type" value='sell' className={type === 'sell'? 'formButtonActive': 'formButton'}>للبيع</button>
                <button type="button" onClick={onMutate} id="type" value='rent' className={type === 'rent'? 'formButtonActive': 'formButton'}>للكراء</button>
                </div>
            </div>
            <div className="form-control">
                <label>اسم العقار</label>
                <input type="text" id="name" value={name} onChange={onMutate} required />
            </div>
            <div className="form-control">
                <div className="button-bed">
                <label>الغرف </label>
                <label>الحمام</label>
                </div>
                <div className="button-bed">
                <input type="number" id="bathrooms" onChange={onMutate} min='1' max='50' value={bathrooms} required />
                <input type="number" id="bedrooms" onChange={onMutate} min='1' max='50' value={bedrooms} required />
                </div>
            </div>
            <div className="form-control">
                <label>يتوفر على موقف سيارات</label>
                <div className="button-form">
                <button type="button" onClick={onMutate} id="parking" value={true} className={parking ? 'formButtonActive': 'formButton'}>نعم</button>
                <button type="button" onClick={onMutate} id="parking" value={false} className={!parking && parking!== null ? 'formButtonActive': 'formButton'}>لا</button>
                </div>
            </div>
            </div>
            
        </form>
      </main>
    </div>
  )
}

export default EditListing
