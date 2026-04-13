'use client';

import { useEffect } from 'react';
import { initEmailJS } from '@/lib/emailjs';

export default function EmailJsInit() {
  useEffect(() => {
    initEmailJS();
  }, []);

  return null;
}
