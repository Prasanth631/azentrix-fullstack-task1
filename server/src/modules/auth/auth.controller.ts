import { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service";
import { AuthRequest } from "../../middleware/auth";
import { sendResponse } from "../../utils/apiResponse";

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      sendResponse({
        res,
        statusCode: 201,
        message: "Account created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      sendResponse({
        res,
        message: "Login successful",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await authService.getProfile(req.userId!);
      sendResponse({
        res,
        message: "Profile retrieved successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(_req: Request, res: Response) {
    sendResponse({
      res,
      message: "Logged out successfully",
    });
  }
}

export const authController = new AuthController();
