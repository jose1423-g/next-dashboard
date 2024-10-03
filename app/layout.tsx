import '@/app/ui/global.css' // la manera correcta de importar el css es en el layout para que toda la aplicacion tenga estilos
import { inter } from '@/app/ui/fonts'; // llamas al archivo fonts para llamar al estilo de letra
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* se agrega el estilo de letra de la siguiente manera className={`${inter.className}`}*/}
      <body className={`${inter.className}`}>{children}</body>
    </html>
  );
}
