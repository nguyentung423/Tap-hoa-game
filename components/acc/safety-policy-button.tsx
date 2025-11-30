"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  Shield,
  X,
  Users,
  MessageSquare,
  Video,
  Search,
  CreditCard,
  CheckCircle,
  AlertTriangle,
  Ban,
  Lock,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Store,
  XOctagon,
} from "lucide-react";

interface SafetyPolicyButtonProps {
  className?: string;
}

export function SafetyPolicyButton({
  className = "",
}: SafetyPolicyButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const openModal = () => setShowModal(true);
  const closeModal = useCallback(() => setShowModal(false), []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [showModal]);

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-primary/10 border border-primary/30 hover:bg-primary/20 transition-colors whitespace-nowrap ${className}`}
      >
        <Shield className="w-4 h-4 text-primary shrink-0" />
        <span className="text-xs font-medium text-primary">
          Cơ chế trung gian
        </span>
      </button>

      {mounted &&
        showModal &&
        createPortal(<SafetyPolicyModal onClose={closeModal} />, document.body)}
    </>
  );
}

function SafetyPolicyModal({ onClose }: { onClose: () => void }) {
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "process"
  );

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ touchAction: "none" }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg max-h-[85vh] flex flex-col bg-[#1a1a2e] rounded-3xl border border-primary/20 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed */}
        <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-5 text-center relative flex-shrink-0 rounded-t-3xl">
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors z-10"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>

          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
            <Shield className="w-8 h-8 text-black" />
          </div>

          <h2 className="text-xl font-bold text-white">
            Cơ chế Trung Gian An Toàn
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Bảo vệ 100% cho mọi giao dịch
          </p>
        </div>

        {/* Scrollable Content */}
        <div
          className="flex-1 overflow-y-auto p-5 space-y-4"
          style={{
            WebkitOverflowScrolling: "touch",
            overscrollBehavior: "contain",
            touchAction: "pan-y",
          }}
        >
          {/* A. Giới thiệu */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
            <p className="text-sm leading-relaxed text-gray-200">
              <span className="text-primary font-semibold">Tạp hoá game</span>{" "}
              chỉ chấp nhận giao dịch qua{" "}
              <span className="text-primary font-semibold">
                Trung Gian chính thức
              </span>
              . Không có giao dịch riêng nào được phép diễn ra. Mục tiêu:{" "}
              <span className="font-medium">
                An toàn – Minh bạch – Chống lừa đảo
              </span>
              .
            </p>
          </div>

          {/* B. Quy trình 6 bước */}
          <CollapsibleSection
            title="Quy trình giao dịch 6 bước"
            icon={<Users className="w-5 h-5 text-blue-400" />}
            isExpanded={expandedSection === "process"}
            onToggle={() => toggleSection("process")}
            color="blue"
          >
            <div className="space-y-3">
              <TimelineStep
                step={1}
                icon={<MessageSquare className="w-4 h-4" />}
                title="Buyer bấm Mua Ngay"
                desc="Kết nối với Trung Gian qua Zalo"
              />
              <TimelineStep
                step={2}
                icon={<Users className="w-4 h-4" />}
                title="Tạo nhóm 3 người"
                desc="Buyer – Seller – Trung Gian"
              />
              <TimelineStep
                step={3}
                icon={<Video className="w-4 h-4" />}
                title="Seller bàn giao"
                desc="FULL INFO + video xác minh"
              />
              <TimelineStep
                step={4}
                icon={<Search className="w-4 h-4" />}
                title="Trung Gian kiểm tra"
                desc="Xác nhận acc đúng mô tả"
              />
              <TimelineStep
                step={5}
                icon={<CreditCard className="w-4 h-4" />}
                title="Buyer thanh toán"
                desc="Chuyển tiền cho Trung Gian"
              />
              <TimelineStep
                step={6}
                icon={<CheckCircle className="w-4 h-4" />}
                title="Hoàn tất"
                desc="Buyer đổi full info → Trung Gian chuyển tiền cho Seller"
              />
            </div>
          </CollapsibleSection>

          {/* C. Cam kết an toàn */}
          <CollapsibleSection
            title="Cam kết an toàn"
            icon={<Lock className="w-5 h-5 text-green-400" />}
            isExpanded={expandedSection === "commitment"}
            onToggle={() => toggleSection("commitment")}
            color="green"
          >
            <ul className="space-y-2">
              <CommitmentItem text="Trung gian công khai trong nhóm" />
              <CommitmentItem text="Không chat riêng" />
              <CommitmentItem text="Không chuyển tiền ngoài nhóm" />
              <CommitmentItem text="Không nhận acc thiếu thông tin" />
            </ul>
          </CollapsibleSection>

          {/* D. Trường hợp từ chối */}
          <CollapsibleSection
            title="Trường hợp bị từ chối"
            icon={<Ban className="w-5 h-5 text-red-400" />}
            isExpanded={expandedSection === "reject"}
            onToggle={() => toggleSection("reject")}
            color="red"
          >
            <ul className="space-y-2">
              <RejectItem text="Seller không cung cấp full info" />
              <RejectItem text="Seller từ chối quay video" />
              <RejectItem text="Buyer yêu cầu giao dịch ngoài web" />
              <RejectItem text="Người bán có dấu hiệu gian lận" />
            </ul>
          </CollapsibleSection>

          {/* E. Chính sách chống back acc */}
          <CollapsibleSection
            title="Chính sách chống back acc"
            icon={<AlertTriangle className="w-5 h-5 text-yellow-400" />}
            isExpanded={expandedSection === "antiback"}
            onToggle={() => toggleSection("antiback")}
            color="yellow"
          >
            <ul className="space-y-2">
              <PolicyItem text="Seller phải gỡ liên kết cũ" />
              <PolicyItem text="Buyer phải đổi 2FA ngay trong nhóm" />
              <PolicyItem text="Trung gian chỉ chịu trách nhiệm trong lúc giao dịch" />
              <PolicyItem text="Back acc sau khi đổi full info → thuộc trách nhiệm Seller" />
              <PolicyItem
                text="Seller back acc = Khóa shop + đưa vào blacklist"
                highlight
              />
            </ul>
          </CollapsibleSection>

          {/* F. Quyền lợi Buyer & Seller */}
          <div className="grid grid-cols-2 gap-3">
            {/* Buyer Benefits */}
            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-3">
                <ShoppingBag className="w-5 h-5 text-blue-400" />
                <span className="font-semibold text-sm text-blue-400">
                  Quyền lợi Buyer
                </span>
              </div>
              <ul className="space-y-1.5">
                <BenefitItem text="Không sợ lừa đảo" color="blue" />
                <BenefitItem
                  text="Kiểm tra acc kỹ trước khi trả tiền"
                  color="blue"
                />
                <BenefitItem text="Không chat riêng bất cứ ai" color="blue" />
                <BenefitItem text="Full info – không bị back" color="blue" />
                <BenefitItem text="Giao dịch minh bạch" color="blue" />
              </ul>
            </div>

            {/* Seller Benefits */}
            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Store className="w-5 h-5 text-purple-400" />
                <span className="font-semibold text-sm text-purple-400">
                  Quyền lợi Seller
                </span>
              </div>
              <ul className="space-y-1.5">
                <BenefitItem text="Bán acc nhanh hơn" color="purple" />
                <BenefitItem text="Không bị buyer troll" color="purple" />
                <BenefitItem text="Trung gian bảo vệ seller" color="purple" />
                <BenefitItem text="Ghi nhận giao dịch" color="purple" />
                <BenefitItem text="Tăng uy tín qua Verified" color="purple" />
              </ul>
            </div>
          </div>

          {/* G. Cảnh báo giao dịch ngoài */}
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                <XOctagon className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="font-semibold text-red-400 text-sm mb-1">
                  ⚠️ Cảnh báo quan trọng
                </p>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Giao dịch ngoài nền tảng{" "}
                  <span className="text-red-400 font-medium">
                    KHÔNG được bảo vệ
                  </span>
                  . Chúng tôi{" "}
                  <span className="text-red-400 font-medium">
                    KHÔNG chịu trách nhiệm
                  </span>{" "}
                  khi buyer/seller tự ý giao dịch riêng.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="p-5 border-t border-white/10 flex-shrink-0 bg-[#1a1a2e] rounded-b-3xl">
          <button
            type="button"
            onClick={handleClose}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-black font-semibold transition-opacity"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
}

// Timeline Step Component
function TimelineStep({
  step,
  icon,
  title,
  desc,
}: {
  step: number;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 text-sm font-bold">
          {step}
        </div>
        {step < 6 && (
          <div className="w-0.5 h-full min-h-[20px] bg-blue-500/20 mt-1" />
        )}
      </div>
      <div className="pb-3">
        <div className="flex items-center gap-2 text-sm font-medium text-white">
          {icon}
          <span>{title}</span>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

// Collapsible Section Component
function CollapsibleSection({
  title,
  icon,
  isExpanded,
  onToggle,
  children,
  color,
}: {
  title: string;
  icon: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  color: "blue" | "green" | "red" | "yellow";
}) {
  const colorClasses = {
    blue: "border-blue-500/20 hover:border-blue-500/40",
    green: "border-green-500/20 hover:border-green-500/40",
    red: "border-red-500/20 hover:border-red-500/40",
    yellow: "border-yellow-500/20 hover:border-yellow-500/40",
  };

  return (
    <div
      className={`rounded-2xl border ${colorClasses[color]} overflow-hidden transition-colors bg-white/5`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-medium text-sm text-white">{title}</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>
      {isExpanded && <div className="p-4 pt-0">{children}</div>}
    </div>
  );
}

// Commitment Item
function CommitmentItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-2 text-sm text-gray-200">
      <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
      <span>{text}</span>
    </li>
  );
}

// Reject Item
function RejectItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-2 text-sm text-gray-200">
      <X className="w-4 h-4 text-red-400 shrink-0" />
      <span>{text}</span>
    </li>
  );
}

// Policy Item
function PolicyItem({
  text,
  highlight,
}: {
  text: string;
  highlight?: boolean;
}) {
  return (
    <li
      className={`flex items-start gap-2 text-sm ${
        highlight ? "text-yellow-400 font-medium" : "text-gray-200"
      }`}
    >
      <AlertTriangle
        className={`w-4 h-4 shrink-0 mt-0.5 ${
          highlight ? "text-yellow-400" : "text-yellow-500/70"
        }`}
      />
      <span>{text}</span>
    </li>
  );
}

// Benefit Item
function BenefitItem({
  text,
  color,
}: {
  text: string;
  color: "blue" | "purple";
}) {
  const colorClasses = {
    blue: "text-blue-400",
    purple: "text-purple-400",
  };

  return (
    <li className="flex items-center gap-1.5 text-xs text-gray-300">
      <CheckCircle className={`w-3 h-3 shrink-0 ${colorClasses[color]}`} />
      <span>{text}</span>
    </li>
  );
}
