import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth";
import { categoryService } from "./category.service";
import { sendResponse } from "../../utils/apiResponse";

export class CategoryController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const categories = await categoryService.getAllCategories(req.userId!);
      sendResponse({
        res,
        message: "Categories retrieved successfully",
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const category = await categoryService.createCategory(
        req.userId!,
        req.body
      );
      sendResponse({
        res,
        statusCode: 201,
        message: "Category created successfully",
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const categoryController = new CategoryController();
