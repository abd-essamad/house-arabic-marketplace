import {useState,useEffect} from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { getDoc, doc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { db } from '../firebase.config'
import Spinner from '../components/spinner/Spinner'
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet'
import {ShareIcon} from '../components/navbar/imports'
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y])
const Listing = () => {
    const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [shareLinkCopied, setShareLinkCopied] = useState(false)

  const navigate = useNavigate()
  const params = useParams()
  const auth = getAuth()

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, 'listings', params.listingId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        setListing(docSnap.data())
        setLoading(false)
      }
    }

    fetchListing()
  }, [navigate, params.listingId])
  if(loading) {
    return <Spinner  />
  }
  return (
    <main>
       <Swiper slidesPerView={1} pagination={{ clickable: true }}>
        {listing.imgUrls.map((url,index) => (
          <SwiperSlide key={index}>
            <div className='swiperSlideDiv'>
              <img style={{backgroundSize: 'cover',width:'100%',
            height:'300px' , backgroundRepeat:'no-repeat',
            backgroundPosition:'center' }} src={listing.imgUrls[index]} alt="" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
    <div className='shareIconDiv' onClick={()=>{
        navigator.clipboard.writeText(window.location.href)
        setShareLinkCopied(true)
        setTimeout(()=>{
        setShareLinkCopied(false)
        },2000)
    }} >
        <ShareIcon fill="#fff" className="img" />
    </div>
    {shareLinkCopied && <p className='linkCopied'>!تم نسخ الرابط</p> }

    <div className="listingDetails">
      <p className='lisitngName'>{listing.name}-{''} {listing.offer ?
       listing.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
       :
        listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
        <p className="location">{listing.location}</p>
        <p className="listingType">
          {listing.type === 'rent' ? 'للكراء ' : 'للبيع'}
        </p>
        {listing.offer && (
          <p className='discountedPrice'>
            ${listing.regularPrice - listing.discountedPrice} discount
          </p>
        )}
        <ul className="listingDetailsList">
           <li>
            {listing.bedrooms > 1 ? ` حمامات ${listing.bedrooms}`: 'حمام واحد'}
           </li>
           <li>
            {listing.bathrooms > 1 ? ` غرف ${listing.bathrooms}`: 'غرفة واحدة'}
           </li>
           <li>{listing.parking && 'موقف سيارات متوفر' }</li>
           <li>{listing.furnished ?  'مجهزة بفراش': 'غير مجهزة بفراش'}</li>
        </ul>
        <p className="locationMap">العنوان على الخريطة</p>
             <div className="leafletContainer">
              <MapContainer style={{height: '300px', width: '500px'}}
              center={[listing.geolocation.lat, listing.geolocation.lng]}
              zoom={13} 
              scrollWheelZoom={false} >
                <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
            />
            <Marker position={[listing.geolocation.lat, listing.geolocation.lng]}
            >
              <Popup>{listing.location}</Popup>
            </Marker>
              </MapContainer>
             </div>

            {auth.currentUser?.uid !== listing.userRef && (
              <Link to={`contact/${listing.userRef}?listingName=${listing.name}`} className="primaryButton" >
                  <p> تواصل مع مالك العقار </p>
              </Link>
            )}
    </div>
      
    </main>
  )
}

export default Listing
