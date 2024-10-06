/* este archivo muestra al usario un mensaje de cargando esto se usaba anteriormente ahora de utilizan los esqueletos */
import DashboardSkeleton from '@/app/ui/skeletons';
/* este componente retorna el esquelto completo de la pagina dashboard tambien se puede poner para cada componente
del dashboard  individual */
export default function Loading() {
    return <DashboardSkeleton />; 
}