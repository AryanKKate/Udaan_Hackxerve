import React from "react";

// Social Media Icons as Components
const SocialLink = ({ href, icon, label }) => (
  <a href={href} target="_blank" rel="noopener" className="flex items-center">
    <span className="sr-only">{label}</span>
    {icon}
  </a>
);

const Twitter = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="currentColor"
  >
    <path d="M24 4.37a9.6 9.6 0 0 1-2.83.8 5.04 5.04 0 0 0 2.17-2.8c-.95.58-2 1-3.13 1.22A4.86 4.86 0 0 0 16.61 2a4.99 4.99 0 0 0-4.79 6.2A13.87 13.87 0 0 1 1.67 2.92 5.12 5.12 0 0 0 3.2 9.67a4.82 4.82 0 0 1-2.23-.64v.07c0 2.44 1.7 4.48 3.95 4.95a4.84 4.84 0 0 1-2.22.08c.63 2.01 2.45 3.47 4.6 3.51A9.72 9.72 0 0 1 0 19.74 13.68 13.68 0 0 0 7.55 22c9.06 0 14-7.7 14-14.37v-.65c.96-.71 1.79-1.6 2.45-2.61z" />
  </svg>
);

const Facebook = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="currentColor"
  >
    <path d="M22.5 0h-21C.67 0 0 .67 0 1.5v21c0 .83.67 1.5 1.5 1.5h21c.83 0 1.5-.67 1.5-1.5v-21C24 .67 23.33 0 22.5 0zM12 2.25c.93 0 1.86.07 2.74.2v2.66H12v3h2.74v7.5h-3.25V8.16H9.25V6.5h1.5V4.9c0-1.7 1.25-2.9 2.8-2.9zm0-1.5C10.52 0 9 1.16 9 3.25v2.75H7.5v3h1.5V18h3.25V10h2.5l.25-3H12V3.25C12 1.93 12.9.75 14.5.75h1.75V2h-1.75C13.5 2 12 2 12 2.25z" />
  </svg>
);

const Instagram = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="currentColor"
  >
    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 22c-5.528 0-10-4.472-10-10s4.472-10 10-10 10 4.472 10 10-4.472 10-10 10zm0-15.25c-2.069 0-3.75 1.681-3.75 3.75s1.681 3.75 3.75 3.75 3.75-1.681 3.75-3.75-1.681-3.75-3.75-3.75zm0 6.25c-1.418 0-2.5-1.082-2.5-2.5s1.082-2.5 2.5-2.5 2.5 1.082 2.5 2.5-1.082 2.5-2.5 2.5zm5.5-6.25c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z" />
  </svg>
);

const LinkedIn = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="currentColor"
  >
    <path d="M20.452 0H3.548C1.586 0 0 1.586 0 3.548v17.904C0 22.414 1.586 24 3.548 24h16.904C22.414 24 24 22.414 24 20.452V3.548C24 1.586 22.414 0 20.452 0zm-11.063 20.451H6.431v-9.1h2.958v9.1zm-1.479-10.31a1.688 1.688 0 1 1 0-3.376 1.688 1.688 0 0 1 0 3.376zm13.464 10.31h-2.958v-4.9c0-1.167-.02-2.66-1.622-2.66-1.624 0-1.87 1.272-1.87 2.59v5.97h-2.958v-9.1h2.835v1.24h.04c.394-.746 1.36-1.534 2.805-1.534 3.001 0 3.554 1.973 3.554 4.54v5.85z" />
  </svg>
);

export function Footer() {
  const navigation = ["Product", "Features", "Pricing", "Company", "Blog"];
  const legal = ["Terms", "Privacy", "Legal"];

  return (
    <div className="relative min-h-[45vh] bg-gray-700">
      <div>
        <div className="grid max-w-screen-xl grid-cols-1 gap-10 pt-10 mx-auto mt-5 border-t border-gray-100 dark:border-trueGray-700 lg:grid-cols-5">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <a
              href="/"
              className="flex items-center space-x-2 text-2xl font-medium text-indigo-500 dark:text-gray-100"
            >
              <img
                src="/logo1.png"
                alt="N"
                width="100"
                height="100"
                className="w-8"
              />
              <span>Udaan</span>
            </a>
            <div className="max-w-md mt-4 text-gray-500 dark:text-gray-400">
            Udaan empowers rural communities with access to micro-loans through a secure, blockchain-powered platform. By leveraging digital identity verification and local partnerships, we make financing simple and trustworthy, helping small businesses and individuals build credit and grow within their communities.
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap w-full -mt-2 -ml-3 lg:ml-0">
            {navigation.map((item, index) => (
              <a
                key={index}
                href="/"
                className="w-full px-4 py-2 text-gray-500 rounded-md dark:text-gray-300 hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 focus:outline-none dark:focus:bg-trueGray-700"
              >
                {item}
              </a>
            ))}
          </div>
          <div className="flex flex-wrap w-full -mt-2 -ml-3 lg:ml-0">
            {legal.map((item, index) => (
              <a
                key={index}
                href="/"
                className="w-full px-4 py-2 text-gray-500 rounded-md dark:text-gray-300 hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 focus:outline-none dark:focus:bg-trueGray-700"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Social Media Links */}
          <div>
            <div className="text-gray-500 dark:text-gray-400">Follow us</div>
            <div className="flex justify-center mt-5 space-x-5 text-gray-400 dark:text-gray-500">
              <SocialLink
                href="https://twitter.com/"
                icon={<Twitter />}
                label="Twitter"
              />
              <SocialLink
                href="https://facebook.com/"
                icon={<Facebook />}
                label="Facebook"
              />
              <SocialLink
                href="https://instagram.com/"
                icon={<Instagram />}
                label="Instagram"
              />
              <SocialLink
                href="https://linkedin.com/"
                icon={<LinkedIn />}
                label="LinkedIn"
              />
            </div>
          </div>
        </div>

        {/* Copyright Notice */}
        <div className="my-10 text-sm text-center text-gray-600 dark:text-gray-400">
          Copyright © {new Date().getFullYear()}. Made with ♥ by 5DNC
        
        </div>
      </div>
    </div>
  );
}
