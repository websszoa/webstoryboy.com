"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpFormValues } from "@/lib/types";
import { signUpSchema } from "@/lib/validations";

import { toast } from "sonner";
import { getRandomFaceImage } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

import LoginButtonGoogle from "./login-button-google";
import LoginButtonKakao from "./login-button-kakao";
import LoginButtonGithub from "./login-button-github";

export function SignUpForm() {
  const router = useRouter();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      repeatPassword: "",
    },
    mode: "onChange",
  });

  const handleSignUp = async (values: SignUpFormValues) => {
    const supabase = createClient();

    try {
      const baseDisplayName = values.email.split("@")[0];
      const randomSuffix = Math.floor(Math.random() * 9000) + 1000;
      const displayName = `${baseDisplayName}${randomSuffix}`;
      const avatarUrl = getRandomFaceImage();

      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${window.location.origin}/callback-email`,
          data: {
            full_name: displayName,
            display_name: displayName,
            avatar_url: avatarUrl,
          },
        },
      });

      if (error) throw error;

      // 이메일 중복 검사
      if (
        data.user &&
        (!data.user.identities || data.user.identities.length === 0)
      ) {
        form.setError("email", {
          type: "manual",
          message: "이미 회원가입이 되어 있는 이메일입니다.",
        });
        return;
      }

      toast.success("회원가입이 완료되었습니다. 이메일을 확인해주세요!");
      router.push("/sign-up-success");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "";
      console.log(errorMessage);
      toast.error("회원가입 실패했습니다.");
    }
  };

  return (
    <div className="border rounded-2xl p-4 md:p-6">
      <form onSubmit={form.handleSubmit(handleSignUp)}>
        <div className="flex flex-col gap-5 mt-1">
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

          <Controller
            control={form.control}
            name="repeatPassword"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="repeatPassword">
                  확인 비밀번호<span className="star">*</span>
                </FieldLabel>
                <Input
                  id="repeatPassword"
                  type="password"
                  placeholder="확인 비밀번호를 입력해주세요!"
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
            {form.formState.isSubmitting ? "회원가입 중..." : "회원가입"}
          </Button>
        </div>
      </form>

      <Divider text="또는" />

      <div className="space-y-2 pt-1">
        <LoginButtonGoogle />
        <LoginButtonKakao />
        <LoginButtonGithub />
      </div>

      <div className="font-anyvid text-muted-foreground text-sm mt-4 text-center">
        회원가입을 하시면{" "}
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
