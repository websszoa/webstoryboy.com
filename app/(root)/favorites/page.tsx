import { APP_NAME, APP_ENG_NAME } from "@/lib/constants";
import PageTitle from "@/components/page/page-title";
import PageFavorites from "@/components/page/page-favorites";
import AuthLogin from "@/components/auth/auth-login";

export const metadata = {
  title: `${APP_NAME} 즐겨찾기 | ${APP_ENG_NAME} Favorites`,
  description:
    "관심 있는 마라톤 대회를 즐겨찾기에 담아 한눈에 확인해보세요. 내가 저장한 마라톤 대회를 편하게 관리할 수 있습니다.",
};

export default function FavoritesPage() {
  return (
    <>
      <PageTitle
        subtitle="Favorites"
        title="즐겨찾기"
        description="관심 있는 글을 저장해두고 언제든지 빠르게 확인해보세요."
      />
      <AuthLogin>
        <PageFavorites />
      </AuthLogin>
    </>
  );
}
