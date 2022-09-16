import { Link } from "react-router-dom"
import rent from '../assets/rent.png'
import sell from '../assets/sell.png'
import ListingItem from "../components/listings/ListingItem"
function Home() {
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

      <div className="home__header house offers">
        
         <p className="categorie__title">عروض مميزة</p>
      </div>
    </main>
  )
}

export default Home
