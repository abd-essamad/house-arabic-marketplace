import { useState, useEffect, useRef } from "react"
import { onAuthStateChanged, getAuth } from "firebase/auth"
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL

} from 'firebase/storage'
import { collection,addDoc, serverTimestamp } from "firebase/firestore"
import {db} from '../firebase.config'
import {v4 as uuidv4} from 'uuid'
import { useNavigate } from "react-router-dom"
import {FaArrowLeft} from 'react-icons/fa'
import Spinner from "../components/spinner/Spinner"
import { toast } from "react-toastify"
const CreateListing = () => {
    const [geloctionEnabled, setGeolocationEnabled] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        type:'rent',
        name:'',
        bedrooms:1,
        bathrooms: 1,
        parking: false,
        furnished:false,
        address:'',
        offer:true,
        surface : 0,
        regularPrice:0,
        discountedPrice:0,
        images: {},
        latitude:0,
        longitude:0
    })
    const {type,name,bedrooms,bathrooms,parking,surface,
    furnished,address,offer,regularPrice,discountedPrice,
images,latitude,longitude} = formData
    const auth = getAuth()
    const navigate = useNavigate()
    const isMounted = useRef(true)

    useEffect(()=>{
        if(isMounted){
            onAuthStateChanged(auth, (user)=>{
                if(user) {
                setFormData({...formData,userRef: user.uid})
            }else {
                navigate('/sign-in')
            }
           
           })
        }

        return ()=> {
            isMounted.current = false
        }
    },[isMounted])
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
            images: e.target.files
            
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
    const onSubmit = async(e)=>{
       e.preventDefault()
       setLoading(true)
       if( discountedPrice >= regularPrice) {
        setLoading(false)
        toast.error('?????? ???? ???????? ?????????? ?????? ?????????????? ???????? ???? ?????????? ????????????')
        return 
       }
       if(images.length > 6){
        setLoading(false)
        toast.error('???????????? ?????? ?????????? 6 ??????')
        return
       }
       let geolocation = {}
       let location 
       if(geloctionEnabled) {
         console.log('geolocation Enabled')
       }else {
        geolocation.lat = latitude
        geolocation.lng = longitude
        location = address
       }
       // Store images in firebase
       const storeImage = async(image)=>{
        return new Promise((resolve,reject)=>{
            const storage = getStorage()
            const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`

            const storageRef = ref(storage, 'images/' + fileName)
            const uploadTask = uploadBytesResumable(storageRef, image)
            uploadTask.on('state_changed', 
  (snapshot) => {
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
    reject(error)
  }, 
  () => {
    // Handle successful uploads on complete
    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      resolve(downloadURL);
    });
  }
);
        })
       }
       const imgUrls = await Promise.all(
        [...images].map((image)=>storeImage(image))
        
       ).catch(()=>{
        setLoading(false)
      
        toast.error('?????? ?????????? ?????????? ??????????')
        return
       })
       console.log(imgUrls)
       const formDataCopy = {
        ...formData,
        imgUrls,
        geolocation,
        timestamp: serverTimestamp(),
       }
       
       delete formDataCopy.images
       delete formDataCopy.address
       formDataCopy.location = address
       !formDataCopy.offer && delete formDataCopy.discountedPrice
       console.log(formDataCopy)
       const docRef = await addDoc(collection(db,'listings'),formDataCopy)
       setLoading(false)
       toast.success('?????? ?????????????? ??????????')
       navigate(`/category/${formDataCopy.type}/${docRef.id}`)

    }
 if(loading) {
    return <Spinner/>
 }
  return (
    <div className='profile listing'>
        <div className="profile__header">
          <p>?????? ???????? ?????????? ???? ????????????</p>
        </div>
        <p className="pro-info">???????????? ?????????? ?????????????????? ???????????? ?????????????? ????????????</p>
      <main className="info">
        <form onSubmit={onSubmit}>
        <div className="side">
            <div className="form-control">
            <div className="pro">
            <button type="submit"  className="primaryButton"><FaArrowLeft className="ic"/>?????????? ????????????</button>
            </div>
            </div>
            </div>
        <div className="right">
           {offer && (
            <div className="form-control">
            <label>?????? ?????? ??????????????</label>
            <div className="button-bed">
            {type === 'rent' && <p>???????? / ??????????</p> }
            <input type="number" id="discountedPrice" min="50" max="7500000" value={discountedPrice} onChange={onMutate} required />
            </div>
            </div>
           )}

            <div className="form-control">
                <label>??????????<span className="small">(???????????? ???????????? ?????????? ???????????? )</span></label>
                <label htmlFor="images" className="addImages" >?????????? ??????</label>
                <div className="button-form">
                <input type="file" style={{display:'none'}}  onChange={onMutate} id="images" max="6" accept=".png,.jpg,.jpeg" multiple  />
                </div>
            </div>
            <div className="form-control">
                <label >??????????????</label>
                <div className="button-bed">
                <p>?????? ????????</p>
                <input type="number"  value={surface} onChange={onMutate} id="surface" required />
                </div>
            </div>
            {!geloctionEnabled && (
                 <div className="form-control">
                 <div className="button-bed">
                 <label>???? ??????????</label>
                 <label>???? ??????????</label>
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
                <label>?????????? ?????? ????????</label>
                <div className="button-form">
                <button type="button" onClick={onMutate} id="furnished" value={true} className={furnished ? 'formButtonActive': 'formButton'}>??????</button>
                <button type="button" onClick={onMutate} id="furnished" value={false} className={!furnished && furnished!== null ? 'formButtonActive': 'formButton'}>????</button>
                </div>
            </div>
            <div className="form-control">
                <label>?????????? ????????????</label>
                <div className="button-form">
                    
                <textarea type="text" id="address" cols="20" rows="3" value={address} onChange={onMutate} required  ></textarea>
                </div>
            </div>
            
            <div className="form-control">
                <label>?????? ??????</label>
                <div className="button-form">
                <button type="button" onClick={onMutate} id="offer" value={true} className={offer ? 'formButtonActive': 'formButton'}>??????</button>
                <button type="button" onClick={onMutate} id="offer" value={false} className={!offer && offer!== null ? 'formButtonActive': 'formButton'}>????</button>
                </div>
            </div>
            <div className="form-control">
                <label>?????? ????????????</label>
                <div className="button-bed">
                {type === 'rent' && <p>???????? / ??????????</p> }
                <input type="number" id="regularPrice" min="50" max="7500000" value={regularPrice} onChange={onMutate} required />
                </div>
            </div>
        </div>
          
            <div className="left">
            <div className="form-control">
                <label>?????????? / ????????????</label>
                <div className="button-form">
                <button type="button" onClick={onMutate} id="type" value='sell' className={type === 'sell'? 'formButtonActive': 'formButton'}>??????????</button>
                <button type="button" onClick={onMutate} id="type" value='rent' className={type === 'rent'? 'formButtonActive': 'formButton'}>????????????</button>
                </div>
            </div>
            <div className="form-control">
                <label>?????? ????????????</label>
                <input type="text" id="name" value={name} onChange={onMutate} required />
            </div>
            <div className="form-control">
                <div className="button-bed">
                <label>?????????? </label>
                <label>????????????</label>
                </div>
                <div className="button-bed">
                <input type="number" id="bathrooms" onChange={onMutate} min='1' max='50' value={bathrooms} required />
                <input type="number" id="bedrooms" onChange={onMutate} min='1' max='50' value={bedrooms} required />
                </div>
            </div>
            <div className="form-control">
                <label>?????????? ?????? ???????? ????????????</label>
                <div className="button-form">
                <button type="button" onClick={onMutate} id="parking" value={true} className={parking ? 'formButtonActive': 'formButton'}>??????</button>
                <button type="button" onClick={onMutate} id="parking" value={false} className={!parking && parking!== null ? 'formButtonActive': 'formButton'}>????</button>
                </div>
            </div>
            </div>
            
        </form>
      </main>
    </div>
  )
}

export default CreateListing
