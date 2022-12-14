import rent from '../../assets/rent.png'
import { BathroomIcon, BedroomIcon,SurfaceIcon } from '../navbar/imports'
import { Link, Navigate, useNavigate } from 'react-router-dom'
const ListingItem = ({listing,id, onDelete}) => {
  const navigate = useNavigate()
  return (
      <div className="rent"  >
        <Link to={`/category/${listing.type}/${id}`}>
           <img src={listing.imgUrls[0]} width='50px' height='50px' alt={listing.name} />
           <p className="price">{listing.offer ?
            listing.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            : listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} Dh
            {listing.type === 'rent' &&  '/Mois'}</p>
           <p className="furnished">{listing.furnished ? 'مفرشة' : 'غير مفرشة'}</p>
           <p className="sale" style={{color: listing.type === 'rent' ? 'yellow' : 'green'}}>{listing
           .type === 'rent' ? 'للكراء' : 'للبيع'}</p>
           <p className='tit'>{listing.name}</p>
           <div className="bathbed">
            <span className='bathroom'><BathroomIcon className='icon' fill='#fff'/>{listing.bathrooms}</span>
            <span className='bedroom'><BedroomIcon className='icon' fill='#fff'/> {listing.bedrooms}</span>
            <span className='surface'><SurfaceIcon className='icon'  fill='#fff'/>{listing.surface} m<sup>2</sup></span>
           </div>
        </Link>
        {onDelete && (
          <div className="buttons-edit">
          <button className='delete' onClick={()=>onDelete(listing.id, listing.name)}>حدف </button>
          <button className='update' onClick={()=>navigate(`/edit-listing/${id}`)} >تعديل</button>
          </div>
        )}
      </div>

  )
}

export default ListingItem
