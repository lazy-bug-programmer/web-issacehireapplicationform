import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getLoggedInUser } from './lib/appwrite/server';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    // Allow access to the root path
    if (request.nextUrl.pathname === '/') {
        return NextResponse.next();
    }

    // Check if the route is an admin route
    if (request.nextUrl.pathname.startsWith('/admin')) {
        try {
            const user = await getLoggedInUser()
            console.log('User:', user);

            // Verify if user has admin privileges
            if (!user || !user.labels?.includes('ADMIN')) {
                // Redirect to login if not an admin
                return NextResponse.redirect(new URL('/login', request.url));
            }

            // Allow access if admin
            return NextResponse.next();
        } catch {
            // Redirect to login if error or not authenticated
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Allow access to all other routes
    return NextResponse.next();
}

// Configure which paths this middleware will run on
export const config = {
    matcher: [
        '/',
        '/admin/:path*',
    ],
};
