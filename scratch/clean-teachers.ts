import { prisma } from "../src/lib/db";

async function main() {
  console.log("Cleaning test teachers from database...");
  const deleted = await prisma.teacher.deleteMany({
    where: {
      OR: [
        { name: { contains: "Deneme" } },
        { email: { contains: "deneme" } },
        { status: "Beklemede" },
      ],
    },
  });
  console.log("Deleted test teachers count:", deleted.count);
}

main().catch(console.error).finally(() => prisma.$disconnect());
