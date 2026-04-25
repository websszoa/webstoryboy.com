import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import NavBottom from "@/components/nav/nav-bottom";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="tutorial__container">{children}</main>
      <Footer variant="tutorial" />
      <NavBottom />
    </>
  );
}
