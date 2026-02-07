import { Footer } from "../components/Footer";
import { getClientsWithoutService } from "@/lib/stats";
import HelpPR from "@/components/HelpPR";
import Petitions from "@/components/Petitions";
import { OutageDataProvider } from "@/components/OutageDataProvider";

export default async function Home() {
  const clients = await getClientsWithoutService();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Compact Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">
            Apagon <span className="text-blue-600">Puerto</span>
            <span className="text-red-500">Rico</span>
          </h1>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Live
            </span>
            <a
              href="https://miluma.lumapr.com/outages/outageMap"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-blue-600 transition-colors hidden sm:block"
            >
              Data Source
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {clients ? (
          <OutageDataProvider fallbackData={clients} />
        ) : (
          <LoadingSkeleton />
        )}
        <HelpPR />
        <Petitions />
      </main>
      <Footer />
    </div>
  );
}

const LoadingSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
    {/* Banner skeleton */}
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="h-4 w-40 bg-gray-200 animate-pulse rounded mb-2" />
      <div className="h-10 w-56 bg-gray-200 animate-pulse rounded" />
    </div>
    {/* Stat cards skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg border border-gray-200 border-l-4 border-l-gray-300 p-5 space-y-3"
        >
          <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
          <div className="h-7 w-32 bg-gray-200 animate-pulse rounded" />
        </div>
      ))}
    </div>
    {/* Grid skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="lg:col-span-2 space-y-3">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg border border-gray-200 p-4 h-20 animate-pulse"
          />
        ))}
      </div>
      <div className="lg:col-span-3 bg-white rounded-lg border border-gray-200 min-h-[400px] animate-pulse" />
    </div>
  </div>
);
