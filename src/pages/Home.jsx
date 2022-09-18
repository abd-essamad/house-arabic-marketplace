import { Link } from "react-router-dom"
import rent from '../assets/rent.png'
import sell from '../assets/sell.png'
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { collection, getDocs, query, where, orderBy, limit
, startAfter } from "firebase/firestore"
import ListingItem from "../components/listings/ListingItem"
import { db } from "../firebase.config"
import { toast } from "react-toastify"
import Spinner from "../components/spinner/Spinner"
import { type } from "@testing-library/user-event/dist/type"
function Home() {
  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(true)
  const params = useParams()
  useEffect(()=>{
      const fetchListings = async ()=>{
        try {
          //get reference
          const listingsRef = collection(db,'listings')
          // create query
          const q = query(listingsRef,where('offer','==',true)
          ,orderBy('timestamp','desc'),
          limit(10))
          // execute query
          const querySnap = await getDocs(q)
          const listings = []
          querySnap.forEach((doc)=>{
          return listings.push({
              id: doc.id,
              data: doc.data()
          })
          })
          setListings(listings)
          setLoading(false)
        } catch (error) {
          toast.error('فشلت العملية')
        }
      }
      fetchListings()
  },[])
  return (
    <main>
      <div className="home__header">
           <p className="title">مرحبا بك عزيزي الزائر</p>
           <p>مرحبا بك في فضاء البحث عن منزل أو شقة أحلامك يمكنك أن تضع بيتا للبيع أو للكراء ان كنت بائعا أو يمكنك
            ايجاد بيت أو شقة  تلائم معاييرك و التواصل مع البائعين
           </p>
           <p  className="more">
            <Link to='/about'>..المزيد من التفاصيل</Link>
           </p>
      </div>
      <div className="home__header house cat">
        <Link to='/category/sell'>
         <div className="rent">
           <img src={rent} alt="" />
           <p>عقارات للبيع</p>
         </div>
         </Link>
         <Link to='/category/rent'>
         <div className="sell">
           <img src={sell} alt="" />
           <p>عقارات للكراء</p>
         </div>
         </Link>
         <p className="categorie__title">فئات العقارات</p>
      </div>
      
      {loading ? (
            <Spinner/> 
          )  : listings && listings.length > 0 ? 
          (
      <div className="home__header house offers">
      {listings.map((listing)=>(
                    <ListingItem listing={listing.data} key={listing.id} id={listing.id} />
                ))}
         <p className="categorie__title">عروض مميزة</p>
      </div>
       ) : 
       (
        <div className="home__header house offers">
         <p className="no-listing" > لا توجد عروض متوفرة حاليا</p>
         <p className="categorie__title" >عروض مميزة</p>
        </div>
       )
     
     }
    
    </main>
  )
}

export default Home
