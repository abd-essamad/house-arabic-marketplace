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
    <main className='swiper'>
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
    {shareLinkCopied && <p className='linkCopied'>!???? ?????? ????????????</p> }

    <div className="listingDetails">
      <p className='lisitngName'>{listing.name}-{''} {listing.offer ?
       listing.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
       :
        listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
        <p className="location">{listing.location}</p>
        <p className="listingType">
          {listing.type === 'rent' ? '???????????? ' : '??????????'}
        </p>
        {listing.offer && (
          <p className='discountedPrice'>
            {listing.regularPrice - listing.discountedPrice} Dh ??????????
          </p>
        )}
        <ul className="listingDetailsList">
           <li>
            {listing.bedrooms > 1 ? ` ???????????? ${listing.bedrooms}`: '???????? ????????'}
           </li>
           <li>
            {listing.bathrooms > 1 ? ` ?????? ${listing.bathrooms}`: '???????? ??????????'}
           </li>
           <li>{listing.parking && '???????? ???????????? ??????????' }</li>
           <li>{listing.furnished ?  '?????????? ??????????': '?????? ?????????? ??????????'}</li>
        </ul>
             <div className="leafletContainer">
             <p className="locationMap">?????????????? ?????? ??????????????</p>
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
                  <p className='contant-landlord'> ?????????? ???? ???????? ???????????? </p>
              </Link>
            )}
    </div>
      
    </main>
  )
}

export default Listing
