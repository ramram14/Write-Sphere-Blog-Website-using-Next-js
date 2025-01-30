'use client';
import { blogCategories } from '@/lib/constants';
import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CategoriesList() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const router = useRouter();

  // Fungsi untuk menangani klik kategori
  const handleCategoryClick = (category: string) => {
    // Arahkan pengguna ke URL dengan parameter category
    router.replace(`/?category=${category}`);
  };

  // Fungsi untuk menggeser ke kiri
  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  // Fungsi untuk menggeser ke kanan
  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  // Fungsi untuk memeriksa scroll position
  const checkScrollPosition = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth);
    }
  };

  return (
    <div className='relative my-4'>
      {/* Tombol Navigasi Kiri */}
      {showLeftArrow && (
        <button
          type='button'
          aria-label='Scroll left'
          onClick={scrollLeft}
          className='absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg z-20 hover:bg-slate-100'
        >
          <ChevronLeft className='w-5 h-5' />
        </button>
      )}

      {/* Container Kategori */}
      <div
        ref={containerRef}
        onScroll={checkScrollPosition}
        className='flex overflow-x-hidden scrollbar-hide scroll-smooth gap-2 py-2'
      >
        {/* Item "For You" */}
        <div
          onClick={() => router.push('/')}
          className='flex-shrink-0 sticky left-0 bg-white z-10 px-4 py-2 border-2 border-slate-200 rounded-lg hover:bg-slate-100 cursor-pointer'>
          For you
        </div>

        {/* Daftar Kategori */}
        {blogCategories.map((item, i) => (
          <div
            onClick={() => handleCategoryClick(item)}
            key={i}
            className='flex-shrink-0 px-4 py-2 border-2 border-slate-200 rounded-lg hover:bg-slate-100 cursor-pointer whitespace-nowrap transition-all duration-200 hover:scale-105'
          >
            {item}
          </div>
        ))}
      </div>

      {/* Tombol Navigasi Kanan */}
      {showRightArrow && (
        <button
          type='button'
          aria-label='Scroll right'
          onClick={scrollRight}
          className='absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg z-20 hover:bg-slate-100'
        >
          <ChevronRight className='w-5 h-5' />
        </button>
      )}
    </div>
  );
}