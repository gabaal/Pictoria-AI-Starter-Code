import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("Webhook is working ", req);
  try {
    //   const body = await req.json();

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.log("Internal server error at training webhook route: ", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
