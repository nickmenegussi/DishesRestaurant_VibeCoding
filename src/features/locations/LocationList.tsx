import { MapPin } from "lucide-react";
import { Card } from "../../components/ui/Card";

export default function LocationList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-main">Locations</h2>
      </div>
      <Card className="p-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface-muted mb-4">
          <MapPin className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-bold text-text-main">Location Management</h3>
        <p className="text-text-muted mt-2">Manage restaurant locations and opening hours.</p>
        <p className="text-xs text-text-muted mt-4">(Feature coming soon)</p>
      </Card>
    </div>
  );
}
