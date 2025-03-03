/**
 * Validation Utilities
 * 
 * This file contains utilities for validating API requests using Zod.
 * It provides a consistent way to validate and parse request data,
 * ensuring type safety and proper error handling.
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { HttpErrors } from './api-response';

/**
 * Validates and parses request body using a Zod schema
 * 
 * @param request - The Next.js request object
 * @param schema - Zod schema to validate against
 * @returns Parsed and validated data
 * @throws HttpError if validation fails
 */
export async function validateBody<T extends z.ZodType>(
  request: NextRequest,
  schema: T
): Promise<z.infer<T>> {
  try {
    const body = await request.json();
    return schema.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw {
        statusCode: 400,
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: formatZodError(error)
      };
    }
    throw {
      statusCode: 400,
      code: 'INVALID_JSON',
      message: 'Invalid JSON in request body'
    };
  }
}

/**
 * Validates and parses URL search params using a Zod schema
 * 
 * @param request - The Next.js request object
 * @param schema - Zod schema to validate against
 * @returns Parsed and validated data
 * @throws HttpError if validation fails
 */
export function validateQuery<T extends z.ZodType>(
  request: NextRequest,
  schema: T
): z.infer<T> {
  try {
    const url = new URL(request.url);
    const queryParams: Record<string, string> = {};
    
    url.searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });
    
    return schema.parse(queryParams);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw {
        statusCode: 400,
        code: 'VALIDATION_ERROR',
        message: 'Invalid query parameters',
        details: formatZodError(error)
      };
    }
    throw {
      statusCode: 400,
      code: 'INVALID_QUERY',
      message: 'Invalid query parameters'
    };
  }
}

/**
 * Validates and parses URL path parameters using a Zod schema
 * 
 * @param params - The route parameters object
 * @param schema - Zod schema to validate against
 * @returns Parsed and validated data
 * @throws HttpError if validation fails
 */
export function validateParams<T extends z.ZodType>(
  params: Record<string, string | string[]>,
  schema: T
): z.infer<T> {
  try {
    return schema.parse(params);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw {
        statusCode: 400,
        code: 'VALIDATION_ERROR',
        message: 'Invalid path parameters',
        details: formatZodError(error)
      };
    }
    throw {
      statusCode: 400,
      code: 'INVALID_PARAMS',
      message: 'Invalid path parameters'
    };
  }
}

/**
 * Formats Zod validation errors into a more user-friendly format
 * 
 * @param error - The Zod error object
 * @returns Formatted error object
 */
function formatZodError(error: z.ZodError) {
  return error.errors.reduce((acc, curr) => {
    const path = curr.path.join('.');
    acc[path] = curr.message;
    return acc;
  }, {} as Record<string, string>);
}

/**
 * Common validation schemas for reuse across the application
 */
export const CommonSchemas = {
  uuid: z.string().uuid('Invalid UUID format'),
  
  pagination: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10)
  }),
  
  dateRange: z.object({
    startDate: z.coerce.date(),
    endDate: z.coerce.date()
  }).refine(data => data.startDate <= data.endDate, {
    message: 'End date must be after start date',
    path: ['endDate']
  }),
  
  // League-specific schemas
  leagueId: z.object({
    leagueId: z.string().uuid('Invalid league ID format')
  }),
  
  // Team-specific schemas
  teamId: z.object({
    teamId: z.string().uuid('Invalid team ID format')
  }),
  
  // Player-specific schemas
  playerId: z.object({
    playerId: z.string().uuid('Invalid player ID format')
  }),
  
  // User-specific schemas
  userId: z.object({
    userId: z.string().uuid('Invalid user ID format')
  })
};

/**
 * Middleware for validating requests
 * Combines validation with error handling
 */
export function withValidation<T>(
  handler: (validData: T) => Promise<any>,
  validator: (req: NextRequest) => Promise<T>
) {
  return async (req: NextRequest) => {
    try {
      const validData = await validator(req);
      return await handler(validData);
    } catch (error: any) {
      if (error.statusCode) {
        return HttpErrors.badRequest(error.message, error.details);
      }
      throw error; // Let the error handler middleware handle other errors
    }
  };
} 