// TODO: Bu dosya deneme hesapları oluşturulduktan sonra silinecektir. (Will be deleted later)
const { PrismaClient } = require("@prisma/client");
const crypto = require("crypto");
require("dotenv").config();

const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = "derslinex_salt_key_12345";
  return crypto.createHmac("sha256", salt).update(password).digest("hex");
}

async function main() {
  console.log("Deneme hesapları oluşturuluyor...");

  // 1. Deneme Öğrenci Hesabı
  const studentEmail = "ogrenci@derslinex.com";
  const existingStudent = await prisma.student.findFirst({ where: { email: studentEmail } });
  
  if (!existingStudent) {
    const student = await prisma.student.create({
      data: {
        name: "Deneme Öğrenci",
        phone: "05555555555",
        email: studentEmail,
        password: hashPassword("sifre123"),
        status: "Beklemede"
      }
    });
    console.log("Öğrenci hesabı oluşturuldu:", student.email);
  } else {
    console.log("Öğrenci hesabı zaten mevcut.");
  }

  // 2. Deneme Öğretmen Hesabı
  const teacherEmail = "ogretmen@derslinex.com";
  const existingTeacher = await prisma.teacher.findFirst({ where: { email: teacherEmail } });

  if (!existingTeacher) {
    const teacher = await prisma.teacher.create({
      data: {
        name: "Deneme Öğretmen",
        phone: "05444444444",
        email: teacherEmail,
        password: hashPassword("sifre123"),
        branch: "Matematik",
        status: "Beklemede"
      }
    });
    console.log("Öğretmen hesabı oluşturuldu:", teacher.email);
  } else {
    console.log("Öğretmen hesabı zaten mevcut.");
  }
}

main()
  .catch((e) => {
    console.error("Hata oluştu:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
