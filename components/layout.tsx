// components/layout.tsx
import React from "react";
import Head from "next/head";

type LayoutProps = {
  children: React.ReactNode;
  title?: string;
};

const Layout: React.FC<LayoutProps> = ({
  children,
  title = "NLQ to MySQL",
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content="Query your MySQL database using natural language."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 flex flex-col items-center p-4 sm:p-8">
        <main className="container mx-auto w-full max-w-4xl">{children}</main>
        <footer className="text-center py-8 text-slate-500 text-sm">
          NLQ to MySQL App
        </footer>
      </div>
    </>
  );
};

export default Layout;
