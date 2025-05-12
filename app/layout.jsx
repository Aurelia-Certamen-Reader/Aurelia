import Link from 'next/link'

export default function Layout({children}) {
    return (
        <html lang="en">
        <head><title>Aurelia</title></head>
        <body className='bg-gray-100'>
            <h1>Aurelia</h1>
            <Link href="/database">Database</Link>
            <main>{children}</main>
        </body>
        </html>
    );
}
