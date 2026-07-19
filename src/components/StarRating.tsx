export default function StarRating({ puan }: { puan: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => {
        const isFull = s <= Math.floor(puan);
        const isHalf = !isFull && s === Math.ceil(puan) && (puan % 1 !== 0);
        
        if (isFull) {
          return (
            <svg
              key={s}
              aria-hidden="true"
              className="w-4 h-4 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          );
        } else if (isHalf) {
          const fillPercent = Math.round((puan % 1) * 100);
          const gradId = `star-grad-${puan.toString().replace('.', '-')}`;
          return (
            <svg
              key={s}
              aria-hidden="true"
              className="w-4 h-4"
              viewBox="0 0 20 20"
            >
              <defs>
                <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset={`${fillPercent}%`} stopColor="#FBBF24" />
                  <stop offset={`${fillPercent}%`} stopColor="#dbdee3" />
                </linearGradient>
              </defs>
              <path
                fill={`url(#${gradId})`}
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>
          );
        } else {
          return (
            <svg
              key={s}
              aria-hidden="true"
              className="w-4 h-4 text-gray-200"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          );
        }
      })}
      <span className="text-sm font-semibold text-gray-700 ml-1">{puan}</span>
    </div>
  );
}
