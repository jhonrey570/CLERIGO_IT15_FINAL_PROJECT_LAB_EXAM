 // Base animated skeleton block
export const SkeletonBlock = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />
);

// Skeleton for menu item cards (grid)
export const MenuCardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow p-4 flex flex-col gap-3">
    <SkeletonBlock className="h-36 w-full" />
    <SkeletonBlock className="h-4 w-3/4" />
    <SkeletonBlock className="h-3 w-1/2" />
    <SkeletonBlock className="h-3 w-1/3" />
    <div className="flex gap-2 mt-2">
      <SkeletonBlock className="h-8 flex-1" />
      <SkeletonBlock className="h-8 flex-1" />
      <SkeletonBlock className="h-8 flex-1" />
    </div>
  </div>
);

// Skeleton for table rows
export const TableRowSkeleton = ({ cols = 5 }) => (
  <tr>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-6 py-4">
        <div className="animate-pulse bg-gray-200 rounded-lg h-4 w-full" />
      </td>
    ))}
  </tr>
);

// Skeleton for dashboard summary cards
export const SummaryCardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-3">
    <SkeletonBlock className="h-3 w-1/3" />
    <SkeletonBlock className="h-8 w-1/2" />
    <SkeletonBlock className="h-3 w-1/4" />
  </div>
);

// Skeleton for charts
export const ChartSkeleton = () => (
  <div className="bg-white rounded-2xl shadow p-6">
    <SkeletonBlock className="h-4 w-1/3 mb-6" />
    <SkeletonBlock className="h-48 w-full" />
  </div>
);

// Skeleton for order cards
export const OrderCardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow p-5 flex flex-col gap-3">
    <div className="flex justify-between">
      <SkeletonBlock className="h-4 w-1/3" />
      <SkeletonBlock className="h-4 w-1/5" />
    </div>
    <SkeletonBlock className="h-3 w-1/4" />
    <div className="border-t border-b border-gray-100 py-3 space-y-2">
      <SkeletonBlock className="h-3 w-full" />
      <SkeletonBlock className="h-3 w-3/4" />
      <SkeletonBlock className="h-3 w-2/3" />
    </div>
    <div className="flex gap-2">
      <SkeletonBlock className="h-8 flex-1" />
      <SkeletonBlock className="h-8 flex-1" />
    </div>
  </div>
);

// Skeleton for POS item cards
export const POSCardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow p-4 flex flex-col gap-2">
    <SkeletonBlock className="h-24 w-full" />
    <SkeletonBlock className="h-3 w-3/4" />
    <SkeletonBlock className="h-3 w-1/2" />
    <SkeletonBlock className="h-4 w-1/3" />
  </div>
);
