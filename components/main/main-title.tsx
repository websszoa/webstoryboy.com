import Link from "next/link";
import { APP_SHORT_DESCRIPTION } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export default function MainTitle() {
  return (
    <div className="main__title text-center pt-2 pb-2">
      <span className="text-sm uppercase tracking-[0.35em] text-red-500 font-poppins">
        webstoryboy
      </span>
      <h2 className="py-1 md:py-2 text-slate-900 text-xl md:text-4xl font-anyvid leading-[1.4]">
        실제로 구현하며, 배우는 개발 경험 이야기.
        <br />
        1인 개발자를 위한 실전 웹 개발 가이드
      </h2>
      <p className="text-muted-foreground font-anyvid">
        {APP_SHORT_DESCRIPTION}
      </p>
      <div className="mt-6">
        <Button
          variant="destructive"
          size="lg"
          className="font-nanumNeo rounded-full"
          asChild
        >
          <Link href="/login">시작하기</Link>
        </Button>
      </div>
    </div>
  );
}
