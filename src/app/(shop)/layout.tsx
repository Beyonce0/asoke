import { I18nProvider } from "@/i18n/client";
import { getDictionary, getLocale } from "@/i18n/server";
import { CartProvider } from "@/store/cart";
import { IntroProvider } from "@/components/motion/intro";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/shop/cart-drawer";

/*
 * The storefront shell. Everything cinematic is scoped here rather than to the
 * root layout, so `/admin` — which shares the same app — gets a plain document
 * with a native scrollbar and no curtain.
 */
export default async function ShopLayout({ children }: LayoutProps<"/">) {
  const [locale, dictionary] = await Promise.all([
    getLocale(),
    getDictionary(),
  ]);

  return (
    <I18nProvider locale={locale} dictionary={dictionary}>
      <CartProvider>
        {/* IntroProvider sits inside SmoothScroll so the curtain can pause
          Lenis while it is on screen. */}
        <SmoothScroll>
          <IntroProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
          </IntroProvider>
        </SmoothScroll>
      </CartProvider>
    </I18nProvider>
  );
}
