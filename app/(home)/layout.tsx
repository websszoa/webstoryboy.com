import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import MobileNav from "@/components/nav/mobile-nav";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="main__container">{children}</main>
      <Footer />
      <MobileNav />
    </>
  );
}
