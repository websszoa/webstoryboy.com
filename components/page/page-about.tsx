import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { APP_NAME, APP_ENG_NAME } from "@/lib/constants";

export default function PageAbout() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl font-anyvid border border-dashed border-gray-200 p-4 md:p-6">
        <section className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-8">
          <div className="relative w-full overflow-hidden rounded-xl border border-gray-100 bg-white">
            <Image
              src={`/${APP_ENG_NAME}.webp`}
              alt={`${APP_NAME} 소개 이미지`}
              width={1200}
              height={800}
              className="h-auto w-full object-cover"
              priority
            />
          </div>

          <div className="space-y-3 text-sm leading-relaxed text-muted-foreground break-keep">
            <h3 className="font-paperlogy text-2xl text-slate-900">
              안녕하세요! {APP_NAME}입니다.
            </h3>

            <p>
              {APP_NAME}는 1인 개발자를 위한 실전 웹 개발 가이드 플랫폼입니다.
              단순한 이론 설명을 넘어, 기획 → 디자인 → 개발 → 배포 → 운영 →
              마케팅까지 실제 서비스 제작 흐름을 자연스럽게 따라가며 학습할 수
              있도록 구성되어 있습니다. 최신 웹 기술을 기반으로 실제 프로젝트에
              적용 가능한 구조와 개발 과정을 중심으로 콘텐츠를 제공합니다.
            </p>
            <p>
              흩어져 있는 웹 개발 정보를 한곳에 모아 원하는 주제를 빠르게
              찾아보고, 필요한 내용을 즐겨찾기로 저장해 언제든 다시 학습할 수
              있도록 설계했습니다. {APP_NAME}는 솔로 개발자가 학습과 개발을
              동시에 이어가며 자신의 프로젝트를 완성할 수 있도록 지속적으로
              개선해 나가고 있습니다.
            </p>
            <p>
              처음 시작하는 개발자부터 실제 서비스를 운영하고 싶은 1인
              개발자까지, 혼자서도 아이디어를 서비스로 구현하고 성장시키는
              과정을 돕는 것이 이 플랫폼의 목표입니다. 이용 중 궁금한 점이나
              개선 아이디어가 있다면 언제든 문의사항을 통해 의견을 남겨주세요.
            </p>

            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-anyvid text-red-500 transition-colors hover:bg-red-500 hover:border-red-500 hover:text-white dark:border-red-500/30 dark:bg-red-500/10 dark:hover:bg-red-500 dark:hover:text-white"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                문의사항 남기기
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
