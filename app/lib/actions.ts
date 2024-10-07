/* se utiliza para los componentes del servidor y tambien se pueden usar en los componentes de clientes se puede usar al mismo tiempo con use client */
/* se utiliza para insertar o actualizar los datos en la base de datos */
'use server';
import { z } from 'zod'; // valida y tranforma los tipos de datos que requiere la base de datos
import { sql } from '@vercel/postgres'; // importamos la conexion a la base de datos
import { revalidatePath } from 'next/cache'; // permite purgar datos almacenados en caché a pedido para una ruta específica.
import { redirect } from 'next/navigation'; // redirecciona al usuario a la pagina que se asigne 
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

/* valida y transforma los tipos de datos para ingresarlos a la base de datos */
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
  .number()
  .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});
 
const CreateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

/* prevState: Contiene el estado que se pasa desde el useActionStategancho. No lo usarás en la acción de este ejemplo, pero es una propiedad obligatoria. */
export async function createInvoice(prevState: State, formData: FormData) {
    
    // const { customerId, amount, status } = CreateInvoice.parse({
    const validatedFields = CreateInvoice.safeParse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });
    
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Invoice.',
      };
    }

    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];
    
    try {
        await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `;    
    } catch (error) {
        return {
            message: 'Database Error: Failed to Create Invoice.',
        };
    }    
    revalidatePath('/dashboard/invoices'); // limpia la cache del usario
    redirect('/dashboard/invoices'); // te retorna a la ruta ingresada dentro de la funcion
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

/* sin validar se usa de la siguiente manera 
export async function updateInvoice(id: string, formData: FormData) { */

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {

   const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }
  
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
 
  try {
    await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
    `;  
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }
  
  revalidatePath('/dashboard/invoices'); //para borrar el caché del cliente y realizar una nueva solicitud al servidor.
  redirect('/dashboard/invoices');
}

/* la funcion deleteInvoice no necesita el redirect ya que la accion de ejeuta en la misma ruta */
export async function deleteInvoice(id: string) {
    // throw new Error('Failed to Delete Invoice');

    try {
        
        await sql`DELETE FROM invoices WHERE id = ${id}`;
        return { message: 'Deleted Invoice.' };

    } catch (error) {

        return { message: 'Database Error: Failed to Delete Invoice.' };
    }

    revalidatePath('/dashboard/invoices');
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}