import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";
import { sendError } from "../utils/apiResponse";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error("Error:", err);

  if (err instanceof AppError) {
    sendError(res, err.statusCode, err.message);
    return;
  }

  // Prisma errors
  if (err.constructor.name === "PrismaClientKnownRequestError") {
    const prismaErr = err as any;
    if (prismaErr.code === "P2002") {
      sendError(res, 409, "A record with this value already exists");
      return;
    }
    if (prismaErr.code === "P2025") {
      sendError(res, 404, "Record not found");
      return;
    }
  }

  // Default server error
  const message =
    process.env.NODE_ENV === "development"
      ? err.message
      : "Internal server error";

  sendError(res, 500, message);
}
