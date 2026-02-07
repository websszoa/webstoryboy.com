"use client";

import { useRouter } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

const ADMIN_VERIFIED_COOKIE = "admin_verified";
const COOKIE_MAX_AGE = 60 * 60; // 1시간

function setAdminVerifiedCookie() {
  document.cookie = `${ADMIN_VERIFIED_COOKIE}=1; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

interface AuthAdminGateProps {
  verified: boolean;
  children: React.ReactNode;
}

export default function AuthAdminGate({
  verified,
  children,
}: AuthAdminGateProps) {
  const router = useRouter();

  if (!verified) {
    const handleSuccess = () => {
      setAdminVerifiedCookie();
      router.refresh();
    };
    return <AdminLoginForm onSuccess={handleSuccess} />;
  }

  return <>{children}</>;
}
