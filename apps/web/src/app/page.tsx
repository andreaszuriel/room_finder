'use client';

import { useEffect, useState } from 'react';
import { getAllCities, getCatalogProperties } from '@/lib/api/axios';
import PropertyCard from '@/components/PropertyCard';
import SearchForm from '@/components/SearchForm';
import Navbar from '../components/Navbar';
import Footer from '@/components/Footer';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';

interface Property {
  id: number;
  name: string;
  image: string;
  price: number;
  rating: number;
  location: string;
  cityName?: string;
  rooms?: { price?: number }[];
  isWishlisted?: boolean;
  minPrice?: number;
}

type City = {
  id: number | string;
  name: string;
};

export default function HomePage() {
  const [recommendedStays, setRecommendedStays] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendedProperties = async () => {
      try {
        const cities = await getAllCities();
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);

        const responses = await Promise.all(
          cities.map((city: City) =>
            getCatalogProperties({
              search: city.name,
              sortBy: 'price',
              sortOrder: 'asc',
              page: 1,
              pageSize: 3,
              startDate: now,
              endDate: tomorrow,
              capacity: 1,
            }),
          ),
        );

        const allProperties = responses.flatMap((res, index) =>
          (res?.data || []).map((prop: Property) => ({
            id: prop.id,
            name: prop.name,
            image: prop.image || '/default-room.jpg',
            location: prop.cityName || cities[index]?.name || 'Indonesia',
            price: prop.minPrice ?? prop.rooms?.[0]?.price ?? prop.price ?? 0,
            rating: prop.rating || 4.5,
            isWishlisted: prop.isWishlisted ?? false,
          })),
        );

        const uniqueProperties = Array.from(
          new Map(allProperties.map((item) => [item.id, item])).values(),
        );

        setRecommendedStays(uniqueProperties);
      } catch (error) {
        console.error('Failed to fetch recommended stays:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedProperties();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero Carousel */}
      <section className="pt-24">
        <Carousel
          autoPlay
          infiniteLoop
          showThumbs={false}
          showStatus={false}
          interval={4000}
          className="rounded-none"
        >
          <div>
            <img
              src="/sakura.jpg"
              alt="Slide 1"
              className="w-full h-[440px] md:h-[480px] object-cover"
            />
          </div>
          <div>
            <img
              src="/diskon_hotel.jpeg"
              alt="Slide 2"
              className="w-full h-[440px] md:h-[480px] object-cover"
            />
          </div>
          <div>
            <img
              src="/city_hotel.jpg"
              alt="Slide 3"
              className="w-full h-[440px] md:h-[480px] object-cover"
            />
          </div>
        </Carousel>
      </section>

      {/* Main Content */}
      <main className="space-y-12 pt-10 pb-16 px-4 md:px-16 w-full">
        {/* Search */}
        {/* Search Form */}
        <section className="py-12 bg-white px-4 md:px-16">
          <div className="max-w-screen-xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Find a Stay</h1>
            <SearchForm />
          </div>
        </section>

        {/* Recommended */}
        <section className="max-w-screen-xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Recommended Stays</h2>

          {loading ? (
            <p>Loading...</p>
          ) : recommendedStays.length === 0 ? (
            <p>No recommended properties available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {recommendedStays.map((property) => (
                <PropertyCard
                  key={`${property.id}-${property.location}`}
                  property={property}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
