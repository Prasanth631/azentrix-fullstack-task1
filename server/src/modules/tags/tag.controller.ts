import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth";
import { tagService } from "./tag.service";
import { sendResponse } from "../../utils/apiResponse";

export class TagController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tags = await tagService.getAll(req.userId!);
      sendResponse({
        res,
        message: "Tags retrieved successfully",
        data: tags,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tag = await tagService.getById(req.params.id as string, req.userId!);
      sendResponse({
        res,
        message: "Tag retrieved successfully",
        data: tag,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tag = await tagService.create(req.userId!, req.body);
      sendResponse({
        res,
        statusCode: 201,
        message: "Tag created successfully",
        data: tag,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tag = await tagService.update(req.params.id as string, req.userId!, req.body);
      sendResponse({
        res,
        message: "Tag updated successfully",
        data: tag,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await tagService.delete(req.params.id as string, req.userId!);
      sendResponse({
        res,
        message: "Tag deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

export const tagController = new TagController();
