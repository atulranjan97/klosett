import { handlers } from '@/auth';

export const { GET, POST } = handlers;
// when we make a get or post request to /api/auth/*, then nextauth takes over
// now nextauth should have access to the route, so if we were to go to /api/auth/session, we get null, null is expected because there is no session at this point of time, but once we implement login functionality and if then user login then we'll get session object as response containing user data if request is made to /api/auth/session
// And to be clear, anything that starts with /api, thats not something that you're gonna link to from within your UI or application. These are used behind the scenes to give you that nextauth functionality
