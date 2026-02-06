import { Heart } from "lucide-react";
import { APP_COPYRIGHT } from "@/lib/constants";

export default function FooterBottom() {
  return (
    <div className="border-t border-gray-300/40 my-8 pt-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-muted-foreground font-nanumNeo">
        <div className="text-xs">{APP_COPYRIGHT}</div>
        <div className="flex items-center gap-2 text-xs">
          <span>Made with</span>
          <Heart className="h-4 w-4 hover:text-brand" />
          <span>for Developers</span>
        </div>
      </div>
    </div>
  );
}
