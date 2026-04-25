import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Profile } from "@/lib/types";

interface HeaderUserProps {
  profile: Profile | null;
}

export default function HeaderUser({ profile }: HeaderUserProps) {
  return (
    <div className="p-4 border-b border-brand/5 dark:border-dark-brand/5 bg-brand/5 dark:bg-dark-brand/5 mt-[-16px]">
      <div className="text-center py-2">
        <div className="flex justify-center mb-2">
          <Avatar className="w-16 h-16 border-2 border-brand/10 dark:border-dark-brand/10">
            {profile?.avatar_url ? (
              <AvatarImage
                src={profile.avatar_url.replace(
                  /\/face\/(face\d+)\.png$/,
                  "/face/$1.webp",
                )}
                alt={profile.full_name ?? "프로필"}
                referrerPolicy="no-referrer"
                className="bg-brand/10 dark:bg-dark-brand/10"
              />
            ) : null}
            <AvatarFallback className="bg-brand/10 dark:bg-dark-brand/10 text-brand dark:text-dark-brand text-2xl font-paperlogy pt-1">
              {(
                profile?.full_name?.charAt(0) ??
                profile?.email?.charAt(0) ??
                "W"
              ).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <h3 className="font-paperlogy font-normal text-lg text-gray-900 dark:text-white mb-1">
          {profile?.full_name
            ? `${profile.full_name}님, 환영합니다!`
            : "환영합니다!"}
        </h3>
        <p className="font-nanumNeo text-sm text-muted-foreground truncate mb-2">
          {profile?.email || "로그인하여 더 많은 기능을 사용해보세요."}
        </p>
      </div>
    </div>
  );
}
