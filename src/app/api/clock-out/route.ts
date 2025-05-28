/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Timesheet } from "@/models/Timesheet";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];
    const { userId } = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
    if (userId) {
      const checkOpenEntry = await Timesheet.findOne({
        userId,
        clockout: null,
      }).sort({ clockIn: -1 });
      if (!checkOpenEntry) {
        return new Response(`No active clock in present`, {
          status: 400,
        });
      } else {
        checkOpenEntry.clockOut = new Date().toISOString();
        await checkOpenEntry.save();
        return new Response(`Clocked Out successfully`, {
          status: 200,
        });
      }
    } else {
      return new Response(`Unauthorized`, {
        status: 400,
      });
    }
  } catch (error) {
    console.error("Error while clocking in user", error);
    return new Response(JSON.stringify({ success: false, error }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
