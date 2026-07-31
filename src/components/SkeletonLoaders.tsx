import React from "react";

// Shimmer base classes — görsel olarak kaydırmalı parıltı efekti
const shimmerBase = "shimmer rounded";

export function StatCardSkeleton() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#1E293B] to-[#0D1B35] border border-white/8 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className={`w-24 h-3 bg-indigo-500/10 ${shimmerBase}`} />
        <div className={`w-9 h-9 rounded-xl bg-indigo-500/10 ${shimmerBase}`} />
      </div>
      <div className={`w-20 h-9 bg-white/8 ${shimmerBase}`} />
      <div className="space-y-1.5">
        <div className={`w-28 h-2.5 bg-white/5 ${shimmerBase}`} />
        <div className={`w-full h-1 bg-white/5 ${shimmerBase}`} />
      </div>
    </div>
  );
}

export function SessionCardSkeleton() {
  return (
    <div className="bg-gradient-to-br from-[#1E293B] to-[#0D1B35] border border-white/8 rounded-2xl p-5 space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2.5 flex-1">
          <div className={`w-28 h-4 bg-indigo-500/15 ${shimmerBase}`} />
          <div className={`w-56 h-5 bg-white/10 ${shimmerBase}`} />
          <div className={`w-36 h-3 bg-white/5 ${shimmerBase}`} />
        </div>
        <div className={`w-28 h-10 bg-white/8 rounded-xl ${shimmerBase}`} />
      </div>
      <div className="flex items-center gap-3 pt-2 border-t border-white/5">
        <div className={`w-8 h-8 rounded-full bg-white/8 ${shimmerBase}`} />
        <div className={`w-32 h-3 bg-white/5 ${shimmerBase}`} />
        <div className={`ml-auto w-20 h-3 bg-white/5 ${shimmerBase}`} />
      </div>
    </div>
  );
}

export function QuestionCardSkeleton() {
  return (
    <div className="bg-gradient-to-br from-[#1E293B] to-[#0D1B35] border border-white/8 rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <div className={`w-16 h-5 bg-indigo-500/15 ${shimmerBase}`} />
          <div className={`w-24 h-5 bg-blue-500/15 ${shimmerBase}`} />
        </div>
        <div className={`w-28 h-4 bg-white/8 ${shimmerBase}`} />
      </div>

      <div className="w-full bg-[#0D1B35] rounded-2xl border border-white/5 p-4 space-y-2.5">
        <div className={`w-3/4 h-3 bg-white/8 ${shimmerBase}`} />
        <div className={`w-1/2 h-3 bg-white/5 ${shimmerBase}`} />
      </div>

      <div className="grid sm:grid-cols-2 gap-3 pt-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-12 bg-[#0D1B35] border border-white/8 rounded-xl ${shimmerBase}`} />
        ))}
      </div>
    </div>
  );
}

export function UserCardSkeleton() {
  return (
    <div className="bg-gradient-to-br from-[#1E293B] to-[#0D1B35] border border-white/8 rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl bg-indigo-500/10 ${shimmerBase}`} />
        <div className="flex-1 space-y-2">
          <div className={`w-36 h-4 bg-white/10 ${shimmerBase}`} />
          <div className={`w-24 h-3 bg-white/5 ${shimmerBase}`} />
        </div>
        <div className={`w-20 h-6 rounded-full bg-white/5 ${shimmerBase}`} />
      </div>
      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/5">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`h-8 bg-white/5 rounded-xl ${shimmerBase}`} />
        ))}
      </div>
      <div className={`w-full h-9 bg-white/5 rounded-xl ${shimmerBase}`} />
    </div>
  );
}
