"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "@/app/_lib/auth-client";
import { Button } from "@/components/ui/button";

const AuthPage = () => {
  const router = useRouter();
  const { data } = authClient.useSession();
  const [bgImageError, setBgImageError] = useState(false);

  useEffect(() => {
    if (data?.user) {
      router.replace("/");
    }
  }, [data?.user, router]);

  if (data?.user) {
    return null;
  }

  const handleGoogleSignIn = () => {
    authClient.signIn.social({
      provider: "google",
      callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
    });
  };

  return (
    <div className="relative min-h-dvh w-full overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-login-hero-bg" />
        <div className="absolute inset-0 overflow-hidden">
          {!bgImageError && (
            <Image
              alt=""
              className="absolute left-[-115.84%] top-[-9.82%] h-full max-w-none w-[354.25%] object-cover"
              src="/login-bg.png"
              fill
              sizes="354vw 100vh"
              priority
              onError={() => setBgImageError(true)}
            />
          )}
        </div>
      </div>
      <div className="absolute left-1/2 top-[48px] h-[38px] w-[85px] -translate-x-1/2">
        <Image
          alt="FIT.AI"
          className="object-contain"
          src="/logo-fit-ai.svg"
          width={85}
          height={39}
          priority
        />
      </div>
      <div className="absolute bottom-0 left-1/2 w-full max-w-[402px] -translate-x-1/2 px-5 pb-10 pt-12">
        <div className="flex flex-col gap-[60px] rounded-t-[20px] bg-primary px-5 pb-10 pt-12">
          <div className="flex flex-col items-center gap-6">
            <p className="text-center font-semibold text-[32px] leading-[1.05] text-primary-foreground">
              O app que vai transformar a forma como você treina.
            </p>
            <Button
              type="button"
              onClick={handleGoogleSignIn}
              className="h-[38px] gap-2 rounded-full bg-card px-6 py-3 text-card-foreground hover:bg-muted hover:text-muted-foreground"
            >
              <Image
                alt=""
                src="/google.svg"
                width={16}
                height={16}
                className="shrink-0"
              />
              Fazer login com Google
            </Button>
          </div>
          <p className="text-center text-xs leading-[1.4] text-primary-foreground/70">
            ©2026 Copyright FIT.AI. Todos os direitos reservados
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
