"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpFormValues } from "@/lib/types";
import { signUpSchema } from "@/lib/validations";

import { toast } from "sonner";
import { getRandomFaceImage, translateError } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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
          emailRedirectTo: `${window.location.origin}/callback`,
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
    } catch (error: any) {
      console.log(error?.message);
      toast.error("회원가입 실패했습니다.");
    }
  };

  return (
    <div className="border rounded-2xl p-4 md:p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSignUp)}>
          <div className="flex flex-col gap-6 mt-1">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    이메일<span className="star">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="이메일을 입력해주세요!"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    비밀번호<span className="star">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="비밀번호를 입력해주세요!"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="repeatPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    확인 비밀번호<span className="star">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="확인 비밀번호를 입력해주세요!"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
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
      </Form>

      <Divider text="또는" />

      <div className="space-y-2 pt-2">
        <LoginButtonGoogle />
        <LoginButtonKakao />
        <LoginButtonGithub />
      </div>
    </div>
  );
}
