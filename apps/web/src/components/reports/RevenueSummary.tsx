interface RevenueSummaryProps {
  totalRevenue: number;
}

export default function RevenueSummary({ totalRevenue }: RevenueSummaryProps) {
  return (
    <div className="flex-1 min-h-[150px] bg-green-100 text-green-700 p-6 rounded-lg shadow-md flex flex-col justify-center items-center">
      <h2 className="font-semibold text-lg mb-2">Total Revenue</h2>
      <p className="text-2xl font-bold">
        Rp {totalRevenue.toLocaleString('id-ID')}
      </p>
    </div>
  );
}
