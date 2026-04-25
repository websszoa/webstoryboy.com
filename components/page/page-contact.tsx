"use client";

import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";
import { ContactFormValues } from "@/lib/types";
import { faqs } from "@/lib/faq";
import { Mails, ChevronRight, ChevronDown, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { contactSchema } from "@/lib/validations";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

interface PageContactProps {
  user: User | null;
}

export default function PageContact({ user }: PageContactProps) {
  const isLoggedIn = !!user;
  const userId = user?.id ?? null;
  const userEmail = user?.email ?? null;
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    if (!userId || !userEmail) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.from("contacts").insert({
        user_id: userId,
        user_email: userEmail,
        message: data.message,
        status: "pending",
      });

      if (error) throw error;

      toast.success("문의가 성공적으로 접수되었습니다.");
      form.reset();
      setIsSubmitted(true);
      setShowForm(false);
    } catch (error) {
      console.error(error);
      toast.error("문의 접수 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="rounded-lg border border-dashed border-gray-200 p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 왼쪽: FAQ */}
        <div className="order-2 lg:order-1 space-y-3 lg:space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="font-anyvid cursor-pointer rounded-lg border border-gray-200 px-4 py-4 sm:py-5 sm:px-5 hover:shadow-md transition-all duration-200 hover:border-brand/50"
            >
              <details className="group">
                <summary className="list-none [&::-webkit-details-marker]:hidden [&::marker]:hidden">
                  <div className="flex items-center gap-3">
                    <Badge className="text-xs shrink-0">{faq.category}</Badge>
                    <h3 className="text-sm text-gray-700 transition-colors flex-1">
                      {faq.title}
                    </h3>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-brand transition-all shrink-0 group-open:hidden" />
                    <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-brand transition-all shrink-0 hidden group-open:block" />
                  </div>
                </summary>

                <div className="pt-4 mt-4 border-t text-muted-foreground">
                  <p className="text-sm leading-relaxed whitespace-pre-line">
                    {faq.content}
                  </p>
                </div>
              </details>
            </div>
          ))}
        </div>

        {/* 오른쪽: 처음엔 카드 → 버튼 클릭 시 작성 폼 */}
        <div className="order-1 lg:order-2 space-y-4 border border-gray-200 rounded-lg p-4 lg:p-6 flex items-center justify-center">
          {!showForm ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 mx-auto mb-3 overflow-hidden">
                  <Image
                    src="/face/face01.webp"
                    alt="프로필"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-gray-700 font-nanumNeo text-xl mb-1">
                  {isSubmitted
                    ? "문의가 정상적으로 접수되었습니다."
                    : isLoggedIn
                      ? "문의를 작성해 주세요"
                      : "로그인이 필요합니다"}
                </h3>
                <p className="text-sm text-muted-foreground font-anyvid mb-4">
                  {isSubmitted
                    ? "빠른 시일 내에 답변드리겠습니다."
                    : isLoggedIn
                      ? "아래 버튼을 클릭하면 문의 작성란을 볼 수 있습니다."
                      : "문의 작성은 로그인 후에만 가능합니다."}
                </p>
              </div>
              {!isLoggedIn ? (
                <Button variant="destructive" size="lg" asChild>
                  <Link href="/login">로그인하기</Link>
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  size="lg"
                  onClick={() => {
                    setShowForm(true);
                    if (isSubmitted) setIsSubmitted(false);
                  }}
                >
                  {isSubmitted ? "새 문의 작성" : "문의 작성하기"}
                </Button>
              )}
            </div>
          ) : (
            <>
              {!isLoggedIn && (
                <div className="flex items-center gap-2 rounded border border-brand/20 bg-brand/5 px-3 py-2.5">
                  <AlertCircle
                    className="h-4 w-4 shrink-0 text-brand"
                    aria-hidden
                  />
                  <p className="text-sm text-gray-700 font-anyvid">
                    로그인 후 작성할 수 있습니다.
                  </p>
                </div>
              )}

              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 w-full"
              >
                <Field data-invalid={!!form.formState.errors.message}>
                  <FieldLabel htmlFor="message">
                    메시지 <span className="star">*</span>
                  </FieldLabel>
                  <Textarea
                    id="message"
                    placeholder="문의 내용을 입력해주세요"
                    rows={10}
                    className="h-50"
                    disabled={!isLoggedIn}
                    aria-invalid={!!form.formState.errors.message}
                    {...form.register("message")}
                  />
                  <FieldError
                    errors={
                      form.formState.errors.message
                        ? [form.formState.errors.message]
                        : undefined
                    }
                  />
                </Field>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    className="font-anyvid flex-1"
                    onClick={() => setShowForm(false)}
                  >
                    취소
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    className="flex-1 bg-brand text-white hover:bg-brand/90"
                    disabled={!isLoggedIn || form.formState.isSubmitting}
                  >
                    <Mails className="w-4 h-4" aria-hidden="true" />
                    {form.formState.isSubmitting ? "전송 중..." : "문의하기"}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
