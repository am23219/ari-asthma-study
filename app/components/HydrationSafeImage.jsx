'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function HydrationSafeImage({ suppressHydrationWarning = true, ...props }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // For critical images (like logos), render immediately but suppress hydration warnings
  if (props.priority) {
    return (
      <div suppressHydrationWarning={suppressHydrationWarning}>
        <Image {...props} />
      </div>
    );
  }

  // For non-critical images, wait for client-side rendering
  if (!isClient) {
    return (
      <div 
        className={props.className}
        style={{
          width: props.width,
          height: props.height,
          backgroundColor: '#f3f4f6',
          borderRadius: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div className="animate-pulse bg-gray-300 rounded w-full h-full"></div>
      </div>
    );
  }

  return (
    <div suppressHydrationWarning={suppressHydrationWarning}>
      <Image {...props} />
    </div>
  );
} 