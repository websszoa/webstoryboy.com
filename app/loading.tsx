import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="size-8 md:size-10 text-brand animate-spin" />
      </div>
    </div>
  );
}
