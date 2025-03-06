/**
 * API Middleware
 * 
 * This file contains middleware functions for API routes to handle
 * common functionality like authentication, error handling, and logging.
 */

import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandling } from '../api-response';
import { supabaseAdmin } from '@/lib/supabase/server';

/**
 * Middleware to ensure the request is authenticated
 * 
 * @param handler - The route handler function
 * @returns A function that checks authentication before calling the handler
 */
export function withAuth(
  handler: (req: NextRequest, userId: string) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      const { data: { session } } = await supabaseAdmin.auth.getSession();
      
      if (!session?.user?.id) {
        return NextResponse.json(
          { success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
          { status: 401 }
        );
      }
      
      return await handler(req, session.user.id);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.json(
        { success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' } },
        { status: 500 }
      );
    }
  };
}

/**
 * Middleware to ensure the request is from an admin user
 * 
 * @param handler - The route handler function
 * @returns A function that checks admin status before calling the handler
 */
export function withAdminAuth(
  handler: (req: NextRequest, userId: string) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      const { data: { session } } = await supabaseAdmin.auth.getSession();
      
      if (!session?.user?.id) {
        return NextResponse.json(
          { success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
          { status: 401 }
        );
      }
      
      // Check if user is an admin
      // This is a placeholder - implement your admin check logic
      const { data: user } = await supabaseAdmin
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single();
      
      if (user?.role !== 'admin') {
        return NextResponse.json(
          { success: false, error: { code: 'FORBIDDEN', message: 'Admin access required' } },
          { status: 403 }
        );
      }
      
      return await handler(req, session.user.id);
    } catch (error) {
      console.error('Admin auth middleware error:', error);
      return NextResponse.json(
        { success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' } },
        { status: 500 }
      );
    }
  };
}

/**
 * Middleware to log API requests
 * 
 * @param handler - The route handler function
 * @returns A function that logs the request before calling the handler
 */
export function withLogging(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const start = Date.now();
    const method = req.method;
    const url = req.url;
    
    console.log(`[API] ${method} ${url}`);
    
    const response = await handler(req);
    
    const duration = Date.now() - start;
    const status = response.status;
    
    console.log(`[API] ${method} ${url} ${status} - ${duration}ms`);
    
    return response;
  };
}

/**
 * Combine multiple middleware functions
 * 
 * @param middlewares - Array of middleware functions to apply
 * @param handler - The route handler function
 * @returns A function with all middleware applied
 */
export function withMiddleware<T extends (req: NextRequest, ...args: any[]) => Promise<any>>(
  middlewares: Array<(handler: any) => any>,
  handler: T
) {
  // Wrap the handler to match the withErrorHandling signature
  const wrappedHandler = async (req: NextRequest, ...args: any[]) => {
    return handler(req, ...args);
  };
  
  return middlewares.reduceRight(
    (acc, middleware) => middleware(acc),
    async (req: NextRequest, ...args: any[]) => withErrorHandling(() => wrappedHandler(req, ...args))
  );
}

/**
 * Common middleware combinations
 */
export const ApiMiddleware = {
  /**
   * Standard middleware for authenticated API routes
   */
  authenticated: <T extends (req: NextRequest, userId: string, ...args: any[]) => Promise<any>>(handler: T) => 
    withMiddleware([withLogging, withAuth], handler),
  
  /**
   * Standard middleware for admin-only API routes
   */
  adminOnly: <T extends (req: NextRequest, userId: string, ...args: any[]) => Promise<any>>(handler: T) => 
    withMiddleware([withLogging, withAdminAuth], handler),
  
  /**
   * Standard middleware for public API routes
   */
  public: <T extends (req: NextRequest, ...args: any[]) => Promise<any>>(handler: T) => 
    withMiddleware([withLogging], handler)
}; 