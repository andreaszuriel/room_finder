'use client';
import SideNavbar from '@/components/User_Navbar/page';

export default function ReviewsPage() {
  const reviews = [
    {
      id: 1,
      property: 'Villa Serenity',
      rating: 5,
      comment: 'Amazing place!',
      date: '2025-06-01',
    },
    {
      id: 2,
      property: 'Urban Loft',
      rating: 4,
      comment: 'Good location, but noisy',
      date: '2025-06-10',
    },
    {
      id: 3,
      property: 'Mountain Retreat',
      rating: 5,
      comment: 'Perfect view and vibe!',
      date: '2025-06-15',
    },
  ];

  return (
    <div className="flex">
      <SideNavbar />
      <main className="ml-64 p-6 w-full">
        <h1 className="text-2xl font-bold mb-4">My Reviews</h1>
        <ul className="space-y-4">
          {reviews.map((r) => (
            <li key={r.id} className="border p-4 rounded-lg bg-white shadow-sm">
              <h2 className="font-semibold">{r.property}</h2>
              <p className="text-yellow-500 mb-1">
                {'★'.repeat(r.rating)}
                {'☆'.repeat(5 - r.rating)}
              </p>
              <p className="italic text-sm text-gray-700">
                &ldquo;{r.comment}&rdquo;
              </p>
              <p className="text-xs text-gray-400 mt-1">Reviewed on {r.date}</p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
