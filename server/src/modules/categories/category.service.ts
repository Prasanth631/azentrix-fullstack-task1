import { categoryRepository } from "./category.repository";
import { ConflictError } from "../../utils/errors";
import { CreateCategoryInput } from "./category.schema";

export class CategoryService {
  async getAllCategories(userId: string) {
    return categoryRepository.findAllForUser(userId);
  }

  async createCategory(userId: string, data: CreateCategoryInput) {
    // Check for duplicates
    const existing = await categoryRepository.findByNameAndType(
      data.name,
      data.type,
      userId
    );

    if (existing) {
      throw new ConflictError(
        `Category "${data.name}" already exists for ${data.type.toLowerCase()}`
      );
    }

    return categoryRepository.create({
      name: data.name,
      type: data.type,
      userId,
    });
  }
}

export const categoryService = new CategoryService();
