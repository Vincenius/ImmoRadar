import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react"

export default function useAuthRedirect() {
  const router = useRouter();
  const { status } = useSession({ required: true, onUnauthenticated() { } })

  useEffect(() => {
    if (status === "authenticated") {
      const { token } = router.query
      const tokenQuery = token ? `?token=${token}` : '';
      router.replace(`/app${tokenQuery}`);
    }
  }, [status, router]);
}