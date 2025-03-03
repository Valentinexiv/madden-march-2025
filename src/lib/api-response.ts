/**
 * API Response Utilities
 * 
 * This file contains utilities for standardizing API responses and error handling
 * across the application. It provides consistent response formats for success and
 * error cases, making it easier to handle responses on the client side.
 */

import { NextResponse } from 'next/server';

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
};

/**
 * Creates a successful API response
 * 
 * @param data - The data to include in the response
 * @param status - HTTP status code (default: 200)
 * @returns NextResponse with standardized format
 */
export function successResponse<T>(data: T, status = 200): NextResponse {
  const response: ApiResponse<T> = {
    success: true,
    data
  };
  
  return NextResponse.json(response, { status });
}

/**
 * Creates an error API response
 * 
 * @param code - Error code (e.g., 'UNAUTHORIZED', 'NOT_FOUND')
 * @param message - Human-readable error message
 * @param details - Additional error details (optional)
 * @param status - HTTP status code (default: 400)
 * @returns NextResponse with standardized error format
 */
export function errorResponse(
  code: string,
  message: string,
  details?: any,
  status = 400
): NextResponse {
  const response: ApiResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details && { details })
    }
  };
  
  return NextResponse.json(response, { status });
}

/**
 * Common HTTP error responses
 */
export const HttpErrors = {
  badRequest: (message = 'Bad Request', details?: Record<string, any>) => 
    errorResponse('BAD_REQUEST', message, details, 400),
    
  unauthorized: (message = 'Unauthorized') => 
    errorResponse('UNAUTHORIZED', message, undefined, 401),
    
  forbidden: (message = 'Forbidden') => 
    errorResponse('FORBIDDEN', message, undefined, 403),
    
  notFound: (message = 'Not Found') => 
    errorResponse('NOT_FOUND', message, undefined, 404),
    
  methodNotAllowed: (allowedMethodsOrMessage: string | string[] = 'Method not allowed', details?: Record<string, any>) => {
    // If the first parameter is a string array, it's the allowed methods
    if (Array.isArray(allowedMethodsOrMessage)) {
      return errorResponse(
        'METHOD_NOT_ALLOWED', 
        `Method not allowed. Allowed methods: ${allowedMethodsOrMessage.join(', ')}`,
        details,
        405
      );
    }
    
    // Otherwise, it's the error message
    return errorResponse('METHOD_NOT_ALLOWED', allowedMethodsOrMessage, details, 405);
  },
    
  conflict: (message = 'Conflict') => 
    errorResponse('CONFLICT', message, undefined, 409),
    
  unprocessableEntity: (message = 'Unprocessable Entity', details?: Record<string, any>) => 
    errorResponse('UNPROCESSABLE_ENTITY', message, details, 422),
    
  tooManyRequests: (message = 'Too Many Requests') => 
    errorResponse('TOO_MANY_REQUESTS', message, undefined, 429),
    
  internalServerError: (message = 'Internal Server Error') => 
    errorResponse('INTERNAL_SERVER_ERROR', message, undefined, 500),
};

/**
 * Error handler for API routes
 * Catches errors and returns appropriate responses
 */
export async function withErrorHandling<T>(
  handler: () => Promise<T>
): Promise<NextResponse> {
  try {
    const result = await handler();
    return successResponse(result);
  } catch (error: any) {
    console.error('API Error:', error);
    
    // Handle known error types
    if (error.code === 'P2025') {
      // Prisma not found error
      return HttpErrors.notFound();
    }
    
    if (error.code === 'P2002') {
      // Prisma unique constraint violation
      return HttpErrors.conflict('A resource with this identifier already exists');
    }
    
    // Handle custom errors with status codes
    if (error.statusCode) {
      return errorResponse(
        error.code || 'UNKNOWN_ERROR',
        error.message || 'An unknown error occurred',
        error.details,
        error.statusCode
      );
    }
    
    // Default to internal server error
    return HttpErrors.internalServerError(
      process.env.NODE_ENV === 'development' 
        ? error.message 
        : 'An unexpected error occurred'
    );
  }
} 