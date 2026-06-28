import api from "@/services/api";
import { Tag } from "@/types/transaction";

export const tagService = {
  async getAll(): Promise<Tag[]> {
    const { data } = await api.get("/tags");
    return data.data;
  },

  async getById(id: string): Promise<Tag> {
    const { data } = await api.get(`/tags/${id}`);
    return data.data;
  },

  async create(name: string): Promise<Tag> {
    const { data } = await api.post("/tags", { name });
    return data.data;
  },

  async update(id: string, name: string): Promise<Tag> {
    const { data } = await api.put(`/tags/${id}`, { name });
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/tags/${id}`);
  },
};
