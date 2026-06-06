import { AuthGuard } from "@/components/AuthGuard";
import { Header } from "@/components/Header";

export default function BoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <Header />
      {children}
    </AuthGuard>
  );
}
