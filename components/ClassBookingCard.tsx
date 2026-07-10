"use client";

export function ClassBookingCard({ name, time, capacity, booked }: { name: string, time: string, capacity: number, booked: number }) {
  const isFull = booked >= capacity;

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-indigo-100 transition">
      <div>
        <h3 className="font-bold text-gray-900 text-lg">{name}</h3>
        <p className="text-gray-500 text-sm mt-1">🕒 {time}</p>
        <div className="mt-2 text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded inline-block">
          Sisa: {capacity - booked} / {capacity}
        </div>
      </div>
      
      <button 
        disabled={isFull}
        className={`w-full sm:w-auto px-6 py-2 rounded-lg font-medium text-sm ${isFull ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
      >
        {isFull ? "Penuh" : "Booking Sekarang"}
      </button>
    </div>
  );
}
