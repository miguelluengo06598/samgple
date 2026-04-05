   import NavBottom from '@/components/nav-bottom'

   export default function RootLayout({ children }) {
     return (
       <html>
         <body style={{ display: 'flex' }}>
           <NavBottom />
           <main style={{ flex: 1, minWidth: 0 }}>
             {children}
           </main>
         </body>
       </html>
      )
    }