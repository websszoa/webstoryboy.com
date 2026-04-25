"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormValues } from "@/lib/types";
import { loginSchema } from "@/lib/validations";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { translateError } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

import LoginButtonGoogle from "./login-button-google";
import LoginButtonKakao from "./login-button-kakao";
import LoginButtonGithub from "./login-button-github";

export function LoginForm() {
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const handleLogin = async (values: LoginFormValues) => {
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;

      // 탈퇴 계정이면 로그인 차단
      const { data: isDeleted } = await supabase.rpc("is_my_account_deleted");
      if (isDeleted === true) {
        await supabase.auth.signOut();
        toast.error("탈퇴한 계정입니다. 관리자에게 문의해주세요.");
        return;
      }

      toast.success("로그인이 되었습니다.");
      router.refresh();
      router.push("/");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "";
      console.log(errorMessage);
      toast.error(translateError(errorMessage));
    }
  };

  return (
    <div className="border rounded-2xl p-4 md:p-6">
      <form onSubmit={form.handleSubmit(handleLogin)}>
        <div className="flex flex-col gap-5">
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email">
                  이메일<span className="star">*</span>
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="이메일을 입력해주세요!"
                  aria-invalid={fieldState.invalid}
                  {...field}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="password">
                  비밀번호<span className="star">*</span>
                </FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="비밀번호를 입력해주세요!"
                  aria-invalid={fieldState.invalid}
                  {...field}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "로그인 중..." : "로그인"}
          </Button>
        </div>
      </form>

      <Divider text="또는" />

      <div className="space-y-2">
        <LoginButtonGoogle />
        <LoginButtonKakao />
        <LoginButtonGithub />
      </div>

      <div className="font-anyvid text-muted-foreground text-sm mt-4 text-center">
        로그인을 하시면{" "}
        <a
          href="/privacy"
          target="_blank"
          className="underline underline-offset-3 hover:text-brand transition-colors"
        >
          개인정보 처리방침
        </a>{" "}
        및{" "}
        <a
          href="/terms"
          target="_blank"
          className="underline underline-offset-3 hover:text-brand transition-colors"
        >
          이용약관
        </a>
        에 <br className="hidden md:block" /> 동의한 것으로 간주됩니다.
      </div>
    </div>
  );
}
