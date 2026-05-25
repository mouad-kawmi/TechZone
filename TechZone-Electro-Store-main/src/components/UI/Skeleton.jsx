
import React from 'react';

const SkeletonBlock = ({ className = '' }) => (
  <div className={`relative overflow-hidden bg-slate-100 dark:bg-slate-800/70 ${className}`}>
    <div className="skeleton-shimmer absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 dark:via-white/10 to-transparent" />
  </div>
);

export const SkeletonCard = () => (
  <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-5 border border-slate-100 dark:border-slate-800 flex flex-col space-y-6">
    <SkeletonBlock className="rounded-[2rem] aspect-[4/3] w-full" />
    <div className="space-y-3 px-2">
      <SkeletonBlock className="h-3 rounded-full w-1/3" />
      <SkeletonBlock className="h-5 rounded-full w-full" />
      <SkeletonBlock className="h-5 rounded-full w-2/3" />
    </div>
    <div className="flex justify-between items-center px-2 pt-4">
      <SkeletonBlock className="h-8 rounded-xl w-1/3" />
      <SkeletonBlock className="size-14 rounded-2xl" />
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 8, columns = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' }) => (
  <div className={`grid ${columns} gap-8 lg:gap-10 animate-fade-up`}>
    {Array.from({ length: count }).map((_, index) => <SkeletonCard key={index} />)}
  </div>
);

export const CatalogSkeleton = ({ withHero = false }) => (
  <div className="page-content bg-white dark:bg-slate-950 min-h-screen transition-colors">
    {withHero && (
      <section className="max-w-[1440px] mx-auto px-6 pt-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center min-h-[420px]">
          <div className="lg:col-span-6 space-y-6">
            <SkeletonBlock className="h-4 rounded-full w-36" />
            <SkeletonBlock className="h-16 rounded-[1.5rem] w-full max-w-xl" />
            <SkeletonBlock className="h-5 rounded-full w-4/5" />
            <SkeletonBlock className="h-5 rounded-full w-2/3" />
            <div className="flex gap-3 pt-4">
              <SkeletonBlock className="h-14 rounded-2xl w-40" />
              <SkeletonBlock className="h-14 rounded-2xl w-14" />
            </div>
          </div>
          <div className="lg:col-span-6">
            <SkeletonBlock className="aspect-[4/3] rounded-[3rem] w-full" />
          </div>
        </div>
      </section>
    )}

    <section className="max-w-[1440px] mx-auto px-6 py-16 lg:py-24">
      <div className="flex flex-col gap-8 mb-12">
        <div className="space-y-4">
          <SkeletonBlock className="h-3 rounded-full w-52" />
          <SkeletonBlock className="h-10 rounded-2xl w-full max-w-md" />
        </div>
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-20 rounded-[1.8rem] min-w-44" />
          ))}
        </div>
      </div>
      <ProductGridSkeleton />
    </section>
  </div>
);

export const SkeletonDetails = () => (
  <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 py-12">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
      <div className="lg:col-span-7 space-y-6">
        <SkeletonBlock className="aspect-[4/3] rounded-[3.5rem]" />
        <div className="grid grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <SkeletonBlock key={i} className="aspect-square rounded-[2rem]" />)}
        </div>
      </div>
      <div className="lg:col-span-5 space-y-8">
        <SkeletonBlock className="h-10 rounded-full w-1/3" />
        <SkeletonBlock className="h-20 rounded-[2rem] w-full" />
        <SkeletonBlock className="h-12 rounded-full w-1/2" />
        <div className="space-y-4 pt-12">
          <SkeletonBlock className="h-16 rounded-3xl w-full" />
          <SkeletonBlock className="h-16 rounded-3xl w-full" />
        </div>
      </div>
    </div>
  </div>
);

export const AdminDashboardSkeleton = ({ embedded = false }) => (
  <div className={`${embedded ? '' : 'min-h-screen bg-[#050508] p-4 md:p-7'}`}>
    <div className="max-w-[1280px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-3">
          <SkeletonBlock className="h-3 rounded-full w-40 bg-slate-800" />
          <SkeletonBlock className="h-9 rounded-2xl w-72 bg-slate-800" />
        </div>
        <div className="flex gap-3">
          <SkeletonBlock className="h-10 rounded-xl w-28 bg-slate-800" />
          <SkeletonBlock className="h-10 rounded-xl w-28 bg-slate-800" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 space-y-8">
            <div className="flex justify-between">
              <SkeletonBlock className="size-11 rounded-xl bg-slate-800" />
              <SkeletonBlock className="h-7 rounded-full w-20 bg-slate-800" />
            </div>
            <div className="space-y-3">
              <SkeletonBlock className="h-3 rounded-full w-28 bg-slate-800" />
              <SkeletonBlock className="h-8 rounded-xl w-36 bg-slate-800" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <SkeletonBlock className="h-96 rounded-2xl bg-slate-800" />
        <SkeletonBlock className="h-96 rounded-2xl bg-slate-800" />
      </div>
    </div>
  </div>
);

export const PageSkeleton = () => (
  <div className="min-h-screen bg-white dark:bg-slate-950 px-6 py-16">
    <div className="max-w-[960px] mx-auto space-y-8">
      <SkeletonBlock className="h-4 rounded-full w-40" />
      <SkeletonBlock className="h-14 rounded-[1.5rem] w-full max-w-xl" />
      <SkeletonBlock className="h-5 rounded-full w-full" />
      <SkeletonBlock className="h-5 rounded-full w-4/5" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-8">
        <SkeletonBlock className="h-44 rounded-[2rem]" />
        <SkeletonBlock className="h-44 rounded-[2rem]" />
      </div>
    </div>
  </div>
);
