export default function LoadingProduct() {
  return (
    <main className="mx-auto w-full max-w-site flex-1 px-4 py-10 sm:px-6" aria-busy="true">
      <div className="h-4 w-56 animate-pulse bg-linen" />
      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="aspect-[4/5] animate-pulse bg-linen" />
        <div className="space-y-4">
          <div className="h-10 w-3/4 animate-pulse bg-linen" />
          <div className="h-6 w-32 animate-pulse bg-linen" />
          <div className="h-40 w-full animate-pulse bg-linen" />
        </div>
      </div>
    </main>
  );
}
