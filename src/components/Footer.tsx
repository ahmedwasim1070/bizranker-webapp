"use client";

// Imports
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

// 
function Footer() {
    const pathname = usePathname();
    const primaryNavigationItems = [
        {
            href: '/about-us',
            label: 'About us',
        },
        {
            href: '/terms-of-usage',
            label: 'Terms Of Usage',
        },
        {
            href: '/privacy-policy',
            label: 'Privacy Policy',
        }
    ]
    const secondaryNavigationItems = [
        {
            href: '/top/world/profiles',
            label: 'Top World Profiles',
            isActive: pathname === '/top/world/profiles',
        },
        {
            href: '/top/country/profiles',
            label: 'Top Country Profiles',
            isActive: pathname === '/top/country/profiles',
        }
    ]

    return (
        <>
            <footer id="footer" className="min-w-screen bg-gradient-to-t from-background to-white border-b-2 border-secondary py-18 px-18">
                <div className="flex md:flex-row xxs:flex-col md:gap-y-0 xxs:gap-y-14 items-center justify-between">

                    {/*  */}
                    <section>
                        <nav>
                            <ul className="space-y-2">
                                {primaryNavigationItems.map((item, idx) => (
                                    <li key={idx} className="text-primary font-semibold 2xl:text-md lg:text-sm transition-colors decoration-secondary hover:text-secondary hover:decoration-primary">
                                        <Link href={item.href} className="underline">{item.label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </section>

                    {/*  */}
                    <section className="space-y-2 flex flex-col items-center">
                        <Link href="/" area-label="Bizranker Buisness Directory Home">
                            <Image
                                src='/main-logo.svg'
                                alt="BizRanker - Business Directory and Ranking Platform Logo"
                                width={170}
                                height={70}
                                className="hover:opacity-80 transition-opacity"
                            />
                        </Link>
                        <h6 className="text-secondary text-xl font-semibold ">Ranking Buisnesses</h6>
                    </section>

                    {/*  */}
                    <section>
                        <nav>
                            <ul className="space-y-2 md:text-right xxs:text-left">
                                {secondaryNavigationItems.map((item, idx) => (
                                    <li key={idx} className={`2xl:text-md lg:text-sm  font-semibold transition-colors decoration-secondary hover:text-secondary hover:decoration-primary ${item.isActive ? 'text-secondary' : 'text-primary'}`}>
                                        <Link href={item.href} className="underline">{item.label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </section>

                </div>
            </footer>
        </>
    )

}

export default Footer;