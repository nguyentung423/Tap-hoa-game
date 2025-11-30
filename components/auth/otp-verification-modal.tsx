"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Loader2, CheckCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface OtpVerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerified: () => void;
}

export function OtpVerificationModal({
  open,
  onOpenChange,
  onVerified,
}: OtpVerificationModalProps) {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Auto-send OTP when modal opens
  useEffect(() => {
    if (open && session?.user?.email && !otpSent) {
      handleSendOtp();
    }
  }, [open, session?.user?.email]);

  const handleSendOtp = async () => {
    if (!session?.user?.email || countdown > 0) return;

    setIsSending(true);
    setError("");

    try {
      const res = await fetch("/api/v1/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Không thể gửi mã OTP");
        return;
      }

      setOtpSent(true);
      setCountdown(60); // 60 seconds cooldown
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsSending(false);
    }
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all filled
    if (newOtp.every((digit) => digit !== "") && newOtp.join("").length === 6) {
      handleVerify(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((digit, index) => {
      if (index < 6) newOtp[index] = digit;
    });
    setOtp(newOtp);

    if (pastedData.length === 6) {
      handleVerify(pastedData);
    }
  };

  const handleVerify = async (code: string) => {
    if (!session?.user?.email) return;

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/v1/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          code,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Mã OTP không đúng");
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
        return;
      }

      // Update user emailVerified in database
      await fetch("/api/v1/auth/verify-email", {
        method: "POST",
      });

      setSuccess(true);

      // Update session
      await update();

      setTimeout(() => {
        onVerified();
        onOpenChange(false);
      }, 1500);
    } catch (err) {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const maskedEmail = session?.user?.email
    ? session.user.email.replace(/(.{2})(.*)(@.*)/, "$1***$3")
    : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            {success ? (
              <CheckCircle className="w-8 h-8 text-green-500" />
            ) : (
              <Mail className="w-8 h-8 text-primary" />
            )}
          </div>
          <DialogTitle className="text-xl">
            {success ? "Xác thực thành công!" : "Xác thực Email"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {success ? (
              "Đang chuyển hướng..."
            ) : (
              <>
                Nhập mã 6 số đã gửi đến
                <br />
                <span className="font-medium text-foreground">
                  {maskedEmail}
                </span>
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        {!success && (
          <div className="space-y-6 py-4">
            {/* OTP Input */}
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  disabled={isLoading || !otpSent}
                  className={cn(
                    "w-12 h-14 text-center text-2xl font-bold",
                    error && "border-red-500 focus-visible:ring-red-500"
                  )}
                />
              ))}
            </div>

            {/* Error message */}
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang xác thực...</span>
              </div>
            )}

            {/* Resend button */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Không nhận được mã?
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSendOtp}
                disabled={countdown > 0 || isSending}
                className="gap-2"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang gửi...
                  </>
                ) : countdown > 0 ? (
                  <>Gửi lại sau {countdown}s</>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Gửi lại mã
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
