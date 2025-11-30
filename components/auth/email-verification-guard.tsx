"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { OtpVerificationModal } from "./otp-verification-modal";

export function EmailVerificationGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status, update } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [showOtpModal, setShowOtpModal] = useState(false);

  // Protected paths that require email verification
  const protectedPaths = ["/seller", "/admin"];
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  useEffect(() => {
    // Only check for authenticated users on protected paths
    if (
      status === "authenticated" &&
      session?.user &&
      isProtectedPath &&
      session.user.emailVerified === false
    ) {
      setShowOtpModal(true);
    }
  }, [session, status, isProtectedPath]);

  const handleVerified = async () => {
    // Refresh session to get updated emailVerified status
    await update();
    setShowOtpModal(false);
    router.refresh();
  };

  return (
    <>
      {children}
      <OtpVerificationModal
        open={showOtpModal}
        onOpenChange={(open) => {
          // Don't allow closing if not verified
          if (!open && session?.user?.emailVerified === false) {
            return;
          }
          setShowOtpModal(open);
        }}
        onVerified={handleVerified}
      />
    </>
  );
}
