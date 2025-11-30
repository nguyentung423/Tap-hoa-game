import { Header, Footer, MobileBottomNav } from "@/components/layout/header";
import { ConditionalFloatingZalo } from "@/components/layout/floating-zalo";
import { EmailVerificationGuard } from "@/components/auth/email-verification-guard";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EmailVerificationGuard>
      <div className="relative min-h-screen bg-dark">
        <Header />
        <main className="pb-20 md:pb-0">{children}</main>
        <Footer />
        <MobileBottomNav />
        <ConditionalFloatingZalo />
      </div>
    </EmailVerificationGuard>
  );
}
