/* muestra al usario un mensaje de error en caso de que haya un error */
'use client'; // permite al usario usar funciones del servidor
/* muestra todos los errores y esta ligado solo a una ruta */
import { useEffect } from 'react';
 
export default function Error({
  error, // Este objeto es una instancia del lenguaje nativo de JavaScript.Errorobjeto
  reset, // Esta es una función para restablecer el límite de error. Cuando se ejecuta, la función intentará volver a representar el segmento de ruta.
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);
 
  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h2 className="text-center">Something went wrong!</h2>
      <button
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
        onClick={
          // Attempt to recover by trying to re-render the invoices route
          () => reset()
        }
      >
        Try again
      </button>
    </main>
  );
}