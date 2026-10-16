export default function Loading() {
  return (
    <div className="pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="skeleton h-3 w-32 mb-4" />
        <div className="skeleton h-12 w-3/4 mb-6" />
        <div className="skeleton h-5 w-full mb-3" />
        <div className="skeleton h-5 w-5/6 mb-12" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200/80 rounded-2xl p-6"
            >
              <div className="skeleton h-11 w-11 rounded-xl mb-5" />
              <div className="skeleton h-4 w-2/3 mb-3" />
              <div className="skeleton h-3 w-full mb-2" />
              <div className="skeleton h-3 w-5/6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
