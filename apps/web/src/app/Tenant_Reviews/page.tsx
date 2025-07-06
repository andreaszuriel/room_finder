'use client';

import React from 'react';
import TenantSidebar from '@/components/Tenant_Navbar/page';
;

export default function TenantReviewsPage() {
  const reviews = [
    {
      id: '1',
      property: 'Mountain Retreat',
      rating: 5,
      comment: 'Amazing place! Highly recommend.',
    },
    {
      id: '2',
      property: 'City Apartment',
      rating: 4,
      comment: 'Great location, clean and comfy.',
    },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <TenantSidebar />

      {/* Main content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-4">My Reviews</h1>
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-lg font-medium">{review.property}</h2>
              <p className="text-yellow-500 mb-1">
                {'★'.repeat(review.rating)} {'☆'.repeat(5 - review.rating)}
              </p>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
