import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { collection, getDocs, query, where, orderBy, limit
, startAfter } from "firebase/firestore"
import ListingItem from "../components/listings/ListingItem"
import { db } from "../firebase.config"
import { toast } from "react-toastify"
import Spinner from "../components/spinner/Spinner"
import { type } from "@testing-library/user-event/dist/type"
const Category = () => {
    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)
    const params = useParams()
    useEffect(()=>{
        const fetchListings = async ()=>{
          try {
            //get reference
            const listingsRef = collection(db,'listings')
            // create query
            const q = query(listingsRef,where('type','==',params.categoryName)
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
    <div className="profile">
      <div className="profile__header">
         {params.categoryName === 'rent' ? 
         <p className="cat-sell"><span>عقارات للكراء</span></p> :
         <p className="cat-rent"><span>عقارات للبيع</span></p> 
         } 
        </div>
        {loading ? (
            <Spinner/> 
          )  : listings && listings.length > 0 ? 
          (
            <div className="home__header house offers">
                {listings.map((listing)=>(
                    <ListingItem listing={listing.data} key={listing.id} id={listing.id} />
                ))}
            </div>
          ) : 
          (
            <p className="no-listing"> لا توجد عقارات في هده الفئة حاليا</p>
          )
        
        }
    </div>
  )
}

export default Category
