import { lazy, Suspense, type ComponentProps } from "react";
import { Spinner } from "@/components/bits";

// Leaflet is ~150 kB; load it only when a customer actually opens the map.
const Picker = lazy(() =>
  import("@/components/MapLocationPickerModal").then((m) => ({ default: m.MapLocationPickerModal }))
);

export function MapLocationPickerModal(props: ComponentProps<typeof Picker>) {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50">
          <Spinner className="h-8 w-8 text-white" />
        </div>
      }
    >
      <Picker {...props} />
    </Suspense>
  );
}
