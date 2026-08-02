import { prisma } from "../src/lib/db";

async function main() {
  console.log("Cleaning test sessions and participants from database...");
  const sf = await prisma.sessionFeedback.deleteMany({});
  const sr = await prisma.sessionResource.deleteMany({});
  const sp = await prisma.sessionParticipant.deleteMany({});
  const ls = await prisma.liveSession.deleteMany({});
  console.log("Deleted feedbacks:", sf.count);
  console.log("Deleted resources:", sr.count);
  console.log("Deleted participants:", sp.count);
  console.log("Deleted sessions:", ls.count);
  console.log("Database clean!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
