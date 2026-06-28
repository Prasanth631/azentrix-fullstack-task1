import { tagRepository } from "./tag.repository";
import { NotFoundError, BadRequestError } from "../../utils/errors";
import { CreateTagInput, UpdateTagInput } from "./tag.schema";

export class TagService {
  async getAll(userId: string) {
    return tagRepository.findAll(userId);
  }

  async getById(id: string, userId: string) {
    const tag = await tagRepository.findById(id, userId);
    if (!tag) {
      throw new NotFoundError("Tag not found");
    }
    return tag;
  }

  async create(userId: string, data: CreateTagInput) {
    const existing = await tagRepository.findByName(data.name, userId);
    if (existing) {
      throw new BadRequestError("Tag with this name already exists");
    }
    return tagRepository.create({ name: data.name, userId });
  }

  async update(id: string, userId: string, data: UpdateTagInput) {
    const existing = await tagRepository.findByName(data.name, userId);
    if (existing && existing.id !== id) {
      throw new BadRequestError("Another tag with this name already exists");
    }
    
    const tag = await tagRepository.update(id, userId, data.name);
    if (!tag) {
      throw new NotFoundError("Tag not found");
    }
    return tag;
  }

  async delete(id: string, userId: string) {
    const deleted = await tagRepository.delete(id, userId);
    if (!deleted) {
      throw new NotFoundError("Tag not found");
    }
    return true;
  }
}

export const tagService = new TagService();
