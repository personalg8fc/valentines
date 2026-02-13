import "./globals.css";

export const metadata = {
  title: "Jhoma <3 Joella",
  description: "I love you maldita!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
