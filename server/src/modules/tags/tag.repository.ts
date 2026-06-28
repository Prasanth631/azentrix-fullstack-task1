import prisma from "../../config/database";

export class TagRepository {
  async findAll(userId: string) {
    return prisma.tag.findMany({
      where: { userId },
      orderBy: { name: "asc" },
    });
  }

  async findById(id: string, userId: string) {
    return prisma.tag.findFirst({
      where: { id, userId },
    });
  }

  async findByName(name: string, userId: string) {
    return prisma.tag.findUnique({
      where: {
        name_userId: {
          name,
          userId,
        },
      },
    });
  }

  async create(data: { name: string; userId: string }) {
    return prisma.tag.create({
      data,
    });
  }

  async update(id: string, userId: string, name: string) {
    return prisma.tag.updateMany({
      where: { id, userId },
      data: { name },
    }).then(async (result) => {
      if (result.count === 0) return null;
      return prisma.tag.findFirst({ where: { id, userId } });
    });
  }

  async delete(id: string, userId: string) {
    const result = await prisma.tag.deleteMany({
      where: { id, userId },
    });
    return result.count > 0;
  }
}

export const tagRepository = new TagRepository();
