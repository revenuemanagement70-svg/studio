import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function HotelCardSkeleton() {
  return (
    <Card className="p-4 flex flex-col md:flex-row gap-6">
      <Skeleton className="w-full md:w-64 h-48 md:h-52 rounded-lg" />
      <div className="flex-grow flex flex-col">
        <div className="flex justify-between items-start">
            <Skeleton className="h-6 w-3/4 rounded" />
            <Skeleton className="h-8 w-16 rounded" />
        </div>
        <Skeleton className="h-4 w-1/2 rounded mt-2 mb-4" />
        <Skeleton className="h-4 w-full rounded mb-2" />
        <Skeleton className="h-4 w-5/6 rounded mb-4" />
        
        <div className="flex flex-wrap gap-2 mb-4">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        <div className="mt-auto flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t">
          <Skeleton className="h-8 w-28 rounded" />
          <Skeleton className="h-12 w-full sm:w-32 rounded-lg" />
        </div>
      </div>
    </Card>
  );
}
