import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../componenets/ListingItem.jsx';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    // Call all fetch functions independently
    fetchOfferListings();
    fetchRentListings();
    fetchSaleListings();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className='flex flex-col items-center justify-center gap-6 py-24 px-3 max-w-7xl mx-auto text-center bg-gradient-to-r from-slate-100 via-white to-slate-100'>
        <h1 className='text-slate-800 font-extrabold text-4xl sm:text-5xl md:text-6xl leading-tight'>
          Find your next{' '}
          <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600'>
            perfect place
          </span>
          <br />
          with ease
        </h1>
        <p className='text-gray-500 text-sm sm:text-base max-w-2xl'>
          NestQuest helps you discover dream homes with modern features, stunning designs, and perfect neighborhoods.
          <br />
          Explore thousands of properties tailored to your needs.
        </p>
        <Link
          to={'/search'}
          className='px-6 py-2 bg-blue-700 text-white rounded-md font-semibold text-sm hover:bg-blue-800 transition'
        >
          Start Your Search
        </Link>
      </div>

      {/* Swiper Section */}
      <div className='relative'>
        {offerListings.length > 1 ? (
          <Swiper navigation loop={true}>
            {offerListings.map((listing) => (
              <SwiperSlide key={listing._id}>
                <div className='relative h-[500px] w-full'>
                  <img
                    src={
                      listing.imageUrls?.[0] ||
                      'https://via.placeholder.com/1200x500?text=No+Image'
                    }
                    alt='listing'
                    className='w-full h-full object-cover'
                    loading='lazy'
                  />
                  <div className='absolute inset-0 bg-black/30'></div>
                  <div className='absolute bottom-10 left-10 text-white z-10'>
                    <h2 className='text-2xl font-bold drop-shadow'>{listing.name}</h2>
                    <p className='text-sm max-w-xl line-clamp-2 drop-shadow-sm'>
                      {listing.description}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : offerListings.length === 1 ? (
          <div className='relative h-[500px] w-full'>
            <img
              src={
                offerListings[0]?.imageUrls?.[0] ||
                'https://via.placeholder.com/1200x500?text=No+Image'
              }
              alt='listing'
              className='w-full h-full object-cover'
              loading='lazy'
            />
            <div className='absolute inset-0 bg-black/30'></div>
            <div className='absolute bottom-10 left-10 text-white z-10'>
              <h2 className='text-2xl font-bold drop-shadow'>
                {offerListings[0]?.name}
              </h2>
              <p className='text-sm max-w-xl line-clamp-2 drop-shadow-sm'>
                {offerListings[0]?.description}
              </p>
            </div>
          </div>
        ) : null}
      </div>

      {/* Listings Section */}
      <div className='max-w-7xl mx-auto px-4 py-12 space-y-12'>
        {/* Offers */}
        {offerListings.length > 0 && (
          <section>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-2xl font-bold text-slate-700'>Recent Offers</h2>
              <Link to='/search?offer=true' className='text-blue-600 text-sm hover:underline'>
                View All Offers
              </Link>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
              {offerListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </section>
        )}

        {/* Rent */}
        {rentListings.length > 0 && (
          <section>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-2xl font-bold text-slate-700'>Recent Places for Rent</h2>
              <Link to='/search?type=rent' className='text-blue-600 text-sm hover:underline'>
                View All Rentals
              </Link>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
              {rentListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </section>
        )}

        {/* Sale */}
        {saleListings.length > 0 && (
          <section>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-2xl font-bold text-slate-700'>Recent Places for Sale</h2>
              <Link to='/search?type=sale' className='text-blue-600 text-sm hover:underline'>
                View All Sales
              </Link>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
              {saleListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
