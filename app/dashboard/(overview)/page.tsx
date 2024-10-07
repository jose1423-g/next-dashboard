/* la carpeta ( overview ) se utiliza o le indica que el archivo que debe de cargar la pagina al inicio es la que contiene dentro 
  y el archivo loading se hereada y se muestra un mesaje de cargando en lo que se obtienen los datos.
  el archivo loading se reemplazo por el compoenente Suspense de react para mostrar los esqueletos de carga
*/
import { Card } from '@/app/ui/dashboard/cards'; // no se utiliza en su lugar se ocupa CardWrapper
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import {fetchRevenue, fetchLatestInvoices, fetchCardData } from '@/app/lib/data'; // se ocupa para llamar a la funcion del archivo data
import CardWrapper from '@/app/ui/dashboard/cards';
import { Suspense } from 'react';
import { RevenueChartSkeleton, LatestInvoicesSkeleton, CardsSkeleton } from '@/app/ui/skeletons';

export default async function Page() {
    // const revenue = await fetchRevenue(); //ejecuta la funcion como si fuera fetch y obtine los datos en la varaible revenue
    // const latestInvoices = await fetchLatestInvoices();
    // const {
    //     totalPaidInvoices,
    //     numberOfCustomers,
    //     totalPendingInvoices,
    //     numberOfInvoices,
    // }  = await fetchCardData()
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* <Card title="Collected" value={totalPaidInvoices} type="collected" />
        <Card title="Pending" value={totalPendingInvoices} type="pending" />
        <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
        <Card
          title="Total Customers"
          value={numberOfCustomers}
          type="customers"
        /> */}
        {/* muestra un esqueleto de precarga */}
         <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        
        {/* el Suspense funciona como el archivo loanding solo que este puede estar solo para un componente el cual tarda en conseguir los datos del servidor 
            se importa la funcion del archivo skeletons para que muestre el esqueleto
        */}
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense >
        {/* <RevenueChart revenue={revenue}  />  se importa el componente y se le pasa la constante para mostrar al componente */}
        {/* <LatestInvoices latestInvoices={latestInvoices} /> */}
      </div>
    </main>
  );
}