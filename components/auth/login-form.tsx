"use client";

import { useForm } from "react-hook-form";
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
      const { data: isDeleted } = await supabase.rpc("get_my_account_deleted");
      if (isDeleted === true) {
        await supabase.auth.signOut();
        toast.error("탈퇴한 계정입니다. 관리자에게 문의해주세요.");
        return;
      }

      toast.success("로그인이 되었습니다.");
      router.refresh();
      router.push("/");
    } catch (error: any) {
      console.log(error?.message);
      toast.error(translateError(error?.message));
    }
  };

  return (
    <div className="border rounded-2xl p-4 md:p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleLogin)}>
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
