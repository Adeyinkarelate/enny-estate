import { Suspense } from 'react';
import AdminLoginForm from '@/components/AdminLoginForm';

function LoginFallback() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-10 flex flex-col items-center gap-4">
        <div className="h-10 w-10 rounded-full border-2 border-green-900 border-t-transparent animate-spin" />
        <p className="text-gray-600 text-sm">Loading sign-in…</p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <AdminLoginForm />
    </Suspense>
  );
}
