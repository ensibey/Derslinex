import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Oturum başarıyla kapatıldı.",
    });

    // Clear the secure HttpOnly derslinex_token cookie
    response.cookies.set("derslinex_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout Error:", error);
    return NextResponse.json(
      { success: false, error: "Çıkış yapılırken bir hata oluştu." },
      { status: 500 }
    );
  }
}
