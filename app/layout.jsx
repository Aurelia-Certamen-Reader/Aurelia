import Link from 'next/link'

export default function Layout({children}) {
    return (
        <html lang="en">
        <head><title>Aurelia</title></head>
        <body>
            <h1>Aurelia</h1>
            <Link href="/database">Database</Link>
            <main>{children}</main>
        </body>
        </html>
    );
}
