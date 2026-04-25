export default function PageTutorial() {
  return (
    <div className="rounded-2xl border border-dashed border-gray-200 p-4 md:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="group rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:border-brand/40 transition-all duration-200"
          >
            {/* 썸네일 */}
            <div className="w-full aspect-video bg-gray-100 dark:bg-white/5" />

            {/* 내용 */}
            <div className="p-4 space-y-2">
              <div className="h-3 w-16 rounded bg-gray-200 dark:bg-white/10" />
              <div className="h-4 w-3/4 rounded bg-gray-300 dark:bg-white/20" />
              <div className="h-3 w-full rounded bg-gray-200 dark:bg-white/10" />
              <div className="h-3 w-2/3 rounded bg-gray-200 dark:bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
