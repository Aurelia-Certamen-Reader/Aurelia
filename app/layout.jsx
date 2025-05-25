import Link from 'next/link'
import AppBar from '@mui/material/AppBar';

export default function Layout({ children }) {
    return (
        <html lang="en">
            <head><title>Aurelia Certamen Reader</title></head>
            <body className='bg-gray-100'>
                <AppBar position='sticky' className='mb-4'>
                    {/* <Link href='/'><h1 className='text-2xl font-bold'>Aurelia</h1></Link> <Link href="/database">Database</Link> */}
                    <div className='flex items-center'> {/* I think ideally I would want them aligned to the bottom? */}
                        <Link href='/' className='mx-4 p-0 my-2 text-2xl font-bold hover:text-gray-200'>Aurelia</Link>
                        <Link href="/database" className='mx-4 p-0 my-2 hover:text-gray-200'>Database</Link>
                    </div>
                </AppBar>
                <main className=' px-4'>{children}</main>
            </body>
        </html>
    );
}
