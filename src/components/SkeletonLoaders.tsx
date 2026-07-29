import React from "react";

export function StatCardSkeleton() {
  return (
    <div className="relative overflow-hidden bg-[#1E293B] border border-white/5 rounded-2xl p-4 animate-pulse space-y-3">
      <div className="flex items-center justify-between">
        <div className="w-20 h-3 bg-white/10 rounded-full" />
        <div className="w-8 h-8 rounded-xl bg-white/10" />
      </div>
      <div className="w-16 h-8 bg-white/10 rounded-lg" />
      <div className="w-24 h-2.5 bg-white/5 rounded-full" />
    </div>
  );
}

export function SessionCardSkeleton() {
  return (
    <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-5 animate-pulse space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="w-24 h-4 bg-indigo-500/20 rounded-full" />
          <div className="w-48 h-5 bg-white/10 rounded-lg" />
          <div className="w-32 h-3 bg-white/5 rounded-md" />
        </div>
        <div className="w-24 h-9 bg-white/10 rounded-xl" />
      </div>
    </div>
  );
}

export function QuestionCardSkeleton() {
  return (
    <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-6 animate-pulse space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-16 h-5 bg-indigo-500/20 rounded-full" />
          <div className="w-24 h-5 bg-blue-500/20 rounded-full" />
        </div>
        <div className="w-28 h-4 bg-white/10 rounded-md" />
      </div>

      <div className="w-full h-16 bg-[#0D1B35] rounded-2xl border border-white/5 p-4 space-y-2">
        <div className="w-3/4 h-3 bg-white/10 rounded-full" />
        <div className="w-1/2 h-3 bg-white/5 rounded-full" />
      </div>

      <div className="grid sm:grid-cols-2 gap-3 pt-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-12 bg-[#0D1B35] border border-white/10 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
