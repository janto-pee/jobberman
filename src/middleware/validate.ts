import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";

/**
 * Middleware that validates request data against a Zod schema
 * @param schema - The Zod schema to validate against
 * @returns Express middleware function
 */
const validateResource =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request data against schema
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Format validation errors for better readability
        const formattedErrors = error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        }));

        return res.status(400).json({
          status: false,
          message: "Validation failed",
          errors: formattedErrors,
        });
      }

      // Handle unexpected errors
      console.error("Validation error:", error);
      return res.status(500).json({
        status: false,
        message: "Internal server error during validation",
      });
    }
  };

export default validateResource;
