
import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";
import { MiddlewareFunction } from "../types/express";
import { HTTP_STATUS } from "../constants/httpConstants";

export interface RequestSchema {
    body?: ObjectSchema;
    params?: ObjectSchema;
    query?: ObjectSchema;
}

interface ValidationOptions {
    stripBody?: boolean;
    stripQuery?: boolean;
    stripParams?: boolean;
}

/**
 * Creates middleware that validates request data using Joi schemas.
 * @param schemas - Schemas for body, params, and query
 * @param options - Options for stripping unknown fields
 * @returns Express validation middleware
 */
export const validateRequest = (
    schemas: RequestSchema,
    options: ValidationOptions = {}
): MiddlewareFunction => {
    const STRIP_BODY: boolean = true;
    const STRIP_PARAMS: boolean = true;
    const STRIP_QUERY: boolean = false;

    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors: string[] = [];

            /**
             * Validates request data against a Joi schema.
             * @param validationSchema - Joi validation schema
             * @param requestData - Data to validate
             * @param shouldStripFields - Whether to strip unknown fields
             * @returns Validated data on success, original data on failure
             */
            const validateRequestSection = <T>(
                validationSchema: ObjectSchema,
                requestData: T,
                shouldStripFields: boolean
            ): T => {
                const { error, value } = validationSchema.validate(
                    requestData,
                    {
                        abortEarly: false,
                        stripUnknown: shouldStripFields,
                    }
                );

                if (error) {
                    errors.push(
                        ...error.details.map((detail) => detail.message)
                    );
                    return requestData;
                }

                return value as T;
            };

            // Validate request body
            if (schemas.body) {
                req.body = validateRequestSection(
                    schemas.body,
                    req.body,
                    options.stripBody ?? STRIP_BODY
                );
            }

            // Validate route parameters
            if (schemas.params) {
                req.params = validateRequestSection(
                    schemas.params,
                    req.params,
                    options.stripParams ?? STRIP_PARAMS
                );
            }

            // Validate query parameters
            if (schemas.query) {
                res.locals.validatedQuery = validateRequestSection(
                    schemas.query,
                    req.query,
                    options.stripQuery ?? STRIP_QUERY
                );
            }

            // Return validation errors
            if (errors.length > 0) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    message: `Validation error: ${errors.join(", ")}`,
                });
                return;
            }

            next();
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error ? error.message : String(error);

            console.error(errorMessage);

            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Error occurred during validation",
            });
        }
    };
};
