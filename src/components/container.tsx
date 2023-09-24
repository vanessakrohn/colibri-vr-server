"use client";

import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const navigation: { name: string; href: string }[] = [
  {
    name: "Renderings",
    href: "/",
  },
  {
    name: "New Rendering",
    href: "/new",
  },
];

function useNavigation() {
  const pathname = usePathname();
  return navigation.map((item) => ({
    ...item,
    current: pathname === item.href,
  }));
}

function classNames(...classes: (string | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export function Container({
  title,
  children,
  buttons,
}: {
  title: string;
  children: ReactNode;
  buttons: ReactNode;
}) {
  const navigation = useNavigation();

  return (
    <>
      <div className="min-h-full">
        <div className="bg-gray-800 pb-32">
          <Disclosure as="nav" className="bg-gray-800">
            {({ open }) => (
              <>
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                  <div className="border-b border-gray-700">
                    <div className="flex h-16 items-center justify-between px-4 sm:px-0">
                      <div className="flex items-center">
                        <div className="hidden md:block">
                          <div className="flex items-baseline space-x-4">
                            {navigation.map((item) => (
                              <a
                                key={item.name}
                                href={item.href}
                                className={classNames(
                                  item.current
                                    ? "bg-gray-900 text-white"
                                    : "text-gray-300 hover:bg-gray-700 hover:text-white",
                                  "rounded-md px-3 py-2 text-sm font-medium",
                                )}
                                aria-current={item.current ? "page" : undefined}
                              >
                                {item.name}
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="-mr-2 flex md:hidden">
                        {/* Mobile menu button */}
                        {navigation.length > 0 ? (
                          <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Open main menu</span>
                            {open ? (
                              <XMarkIcon
                                className="block h-6 w-6"
                                aria-hidden="true"
                              />
                            ) : (
                              <Bars3Icon
                                className="block h-6 w-6"
                                aria-hidden="true"
                              />
                            )}
                          </Disclosure.Button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>

                {navigation.length > 0 ? (
                  <Disclosure.Panel className="border-b border-gray-700 md:hidden">
                    <div className="space-y-1 px-2 py-3 sm:px-3">
                      {navigation.map((item) => (
                        <Disclosure.Button
                          key={item.name}
                          as="a"
                          href={item.href}
                          className={classNames(
                            item.current
                              ? "bg-gray-900 text-white"
                              : "text-gray-300 hover:bg-gray-700 hover:text-white",
                            "block rounded-md px-3 py-2 text-base font-medium",
                          )}
                          aria-current={item.current ? "page" : undefined}
                        >
                          {item.name}
                        </Disclosure.Button>
                      ))}
                    </div>
                  </Disclosure.Panel>
                ) : null}
              </>
            )}
          </Disclosure>
          <header className="py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="md:flex md:items-center md:justify-between">
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">
                    {title}
                  </h1>
                </div>
                <div className="mt-4 flex md:ml-4 md:mt-0">{buttons}</div>
              </div>
            </div>
          </header>
        </div>

        <main className="-mt-32">
          <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
            <div className="rounded-lg bg-white px-5 py-6 shadow sm:px-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
