export default function LoadingShop() {
  return (
    <main className="mx-auto w-full max-w-site flex-1 px-4 py-10 sm:px-6" aria-busy="true">
      <div className="h-10 w-64 animate-pulse bg-linen" />
      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-[4/5] animate-pulse bg-linen" />
            <div className="mt-3 h-4 w-3/4 animate-pulse bg-linen" />
          </div>
        ))}
      </div>
    </main>
  );
}
