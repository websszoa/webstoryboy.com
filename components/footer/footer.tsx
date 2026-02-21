import FooterMenu from "./footer-menu";
import FooterInfo from "./footer-info";
import FooterBottom from "./footer-bottom";

export default function Footer() {
  return (
    <footer className="footer__container">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-8 border-t border-gray-300/40 pt-6 md:pt-12">
        <FooterInfo />
        <FooterMenu />
      </div>
      <FooterBottom />
    </footer>
  );
}
