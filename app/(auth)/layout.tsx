export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="flex-center min-h-screen w-full">{children}</div>;
}

// `flex-center` is the utility class that we defined in the `assets/styles/globals.css`