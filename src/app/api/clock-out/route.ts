/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Timesheet } from "@/models/Timesheet";
import jwt from "jsonwebtoken";
import { User } from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.split(" ")[1] as string;
    const secret = process.env.NEXT_PUBLIC_JWT_SECRET as string;
    const { userId } = jwt.verify(token, secret) as { userId: string };
    if (userId) {
      const checkOpenEntry = await Timesheet.findOne({
        userId,
        clockout: null,
      }).sort({ clockIn: -1 });
      if (!checkOpenEntry) {
        await User.findOneAndUpdate(
          { _id: userId },
          { $set: { status: false } }
        );
        return new Response(
          JSON.stringify({ message: `No active clock in present` }),
          {
            status: 400,
          }
        );
      } else {
        await User.findOneAndUpdate(
          { _id: userId },
          { $set: { status: false } }
        );
        checkOpenEntry.clockOut = new Date().toISOString();
        await checkOpenEntry.save();
        return new Response(
          JSON.stringify({ message: `Clocked Out successfully` }),
          {
            status: 200,
          }
        );
      }
    } else {
      return new Response(JSON.stringify({ message: `Unauthorized` }), {
        status: 400,
      });
    }
  } catch (error) {
    console.error("Error while clocking out user", error);
    return new Response(JSON.stringify({ success: false, error }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
