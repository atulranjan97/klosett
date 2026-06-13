export { auth as proxy } from '@/auth';
// is ek line ka matlab hai "Har request pe NextAuth ka auth function chalaao — jo internally authorized callback invoke karega"

// We need to just set up our proxy to use our auth file or function(authorized) and that will run on every request unless we specify certain routes and we don't want that proxy to be used on
// Proxy is just a function that we can run between the request and response, So it'll run on every page
// if you want certain routes that you need to be logged in or you need to be admin
