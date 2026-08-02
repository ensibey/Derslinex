import { prisma } from "../src/lib/db";

async function main() {
  const rooms = await prisma.chatRoom.count();
  const msgs = await prisma.chatMessage.count();
  const contact = await prisma.contactMessage.count();
  const feedbacks = await prisma.feedback.count();
  const students = await prisma.student.count();
  const teachers = await prisma.teacher.count();
  console.log("DB Stats:", { students, teachers, rooms, msgs, contact, feedbacks });
}

main().catch(console.error).finally(() => prisma.$disconnect());
