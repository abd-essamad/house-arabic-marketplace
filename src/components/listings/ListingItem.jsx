import rent from '../../assets/rent.png'
import { BathroomIcon, BedroomIcon,SurfaceIcon } from '../navbar/imports'
import { Link } from 'react-router-dom'
const ListingItem = ({listing,id}) => {
  return (
      <div className="rent"  >
        <Link to={`/category/${listing.type}/${id}`}>
           <img src={listing.imageUrls[0]} width='50px' height='50px' alt={listing.name} />
           <p className="price">{listing.offer ?
            listing.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            : listing.regularPricetoString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} Dh
            {listing.type === 'rent' &&  '/Mois'}</p>
           <p className="furnished">مفرشة</p>
           <p className="sale" style={{color: listing.type === 'rent' ? 'yellow' : 'green'}}>{listing
           .type === 'rent' ? 'للكراء' : 'للبيع'}</p>
           <p className='tit'>{listing.name}</p>
           <div className="bathbed">
            <span className='bathroom'><BathroomIcon className='icon' fill='#fff'/>{listing.bathrooms}</span>
            <span className='bedroom'><BedroomIcon className='icon' fill='#fff'/> {listing.bedrooms}</span>
            <span className='surface'><SurfaceIcon className='icon'  fill='#fff'/>30 m<sup>2</sup></span>
           </div>
        </Link>
      </div>

  )
}

export default ListingItem
