"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function MockPaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  const paymentId = searchParams.get("payment_id");

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/dashboard");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-card p-12 max-w-lg text-center space-y-6">
        <div className="text-6xl mb-4">🎭</div>
        <h1 className="text-3xl font-black text-white">
          DEMO MODE
        </h1>
        <p className="text-xl text-gray-300">
          Это демонстрационная страница оплаты
        </p>
        
        <div className="glass-effect rounded-xl p-6 text-left space-y-3">
          <p className="text-sm text-gray-300">
            <span className="font-bold text-purple-400">Payment ID:</span> {paymentId}
          </p>
          <p className="text-sm text-gray-300">
            <span className="font-bold text-purple-400">Статус:</span> MOCK - Успешно
          </p>
          <p className="text-sm text-gray-400">
            В production режиме здесь будет форма оплаты ЮKassa
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-gray-400">
            Автоматический редирект через <span className="text-2xl font-bold text-gradient">{countdown}</span> сек...
          </p>
          <Button 
            onClick={() => router.push("/dashboard")}
            size="lg"
            glow
          >
            Вернуться к событиям
          </Button>
        </div>

        <div className="text-xs text-gray-500 mt-6">
          Для включения реальных платежей установите <code className="bg-white/10 px-2 py-1 rounded">TWELVEDR_ENABLE_PAYMENT_MOCKS=false</code>
        </div>
      </div>
    </div>
  );
}
