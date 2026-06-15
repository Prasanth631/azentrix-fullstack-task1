import { PrismaClient, TransactionType } from "@prisma/client";

const prisma = new PrismaClient();

const defaultCategories = [
  // Income categories
  { name: "Salary", type: TransactionType.INCOME },
  { name: "Freelance", type: TransactionType.INCOME },
  { name: "Investments", type: TransactionType.INCOME },
  { name: "Business", type: TransactionType.INCOME },
  { name: "Other", type: TransactionType.INCOME },

  // Expense categories
  { name: "Food", type: TransactionType.EXPENSE },
  { name: "Travel", type: TransactionType.EXPENSE },
  { name: "Shopping", type: TransactionType.EXPENSE },
  { name: "Bills", type: TransactionType.EXPENSE },
  { name: "Entertainment", type: TransactionType.EXPENSE },
  { name: "Health", type: TransactionType.EXPENSE },
  { name: "Education", type: TransactionType.EXPENSE },
  { name: "Other", type: TransactionType.EXPENSE },
];

async function main() {
  console.log("🌱 Seeding default categories...");

  for (const category of defaultCategories) {
    await prisma.category.upsert({
      where: {
        name_type_userId: {
          name: category.name,
          type: category.type,
          userId: "", // system-level default (no user)
        },
      },
      update: {},
      create: {
        name: category.name,
        type: category.type,
        isDefault: true,
        userId: null,
      },
    });
  }

  console.log("✅ Default categories seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
