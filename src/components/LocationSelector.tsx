// Imports
import AreaSelectorProvider from "@/app/providers/AreaSelectorProvider";
import Link from "next/link";
// Components
import CountryLister from "./CountryLister";

// 
function LocationSelector() {
  const navigationItems = [
    {
      href: '/top/world/profiles',
      label: 'Top World Profiles',
    },
    {
      href: '/top/country/profiles',
      label: 'Top Country Profiles',
    }
  ]

  return (
    <>
      <dialog role="dialog" aria-labelledby="location-title" aria-modal="true" className="fixed z-50 min-w-screen min-h-screen flex flex-col items-center space-y-2 justify-center bg-background/60 overflow-hidden backdrop-blur-sm">
        <h2 className="text-3xl text-primary font-semibold">Failed to fetch location.</h2>

        <p className="text-secondary text-lg font-semibold">Select Manually.</p>

        <form className="flex flex-row space-x-4 items-center justify-center">

          {/*  */}
          <AreaSelectorProvider>
            <CountryLister />
          </AreaSelectorProvider>

        </form>

        <h3 className="text-secondary font-bold">Or</h3>

        <h4 className="text-primary font-bold">Continue to</h4>

        <nav>
          <ul className="inline-flex space-x-2">
            {navigationItems.map((item, idx) => (
              <li key={idx} className="list-none text-secondary">
                <Link className="translate-x-full hover:text-primary hover:decoration-secondary duration-100 underline decoration-primary group" href={item.href} title={item.label} >
                  <span className="text-primary group-hover:text-secondary">|</span> {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <span className="text-primary">Cookies should be enabled for best experience.</span>

      </dialog>
    </>
  )
}

export default LocationSelector;