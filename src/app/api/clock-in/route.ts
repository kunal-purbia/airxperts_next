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
    const token = authHeader?.split(" ")[1];
    const { userId } = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
    if (userId) {
      const checkOpenEntry = await Timesheet.findOne({
        userId,
        clockOut: null,
      });
      if (checkOpenEntry) {
        await User.findOneAndUpdate(
          { _id: userId },
          { $set: { status: true } }
        );
        return new Response(
          JSON.stringify({ message: `Active Clock-In is present` }),
          {
            status: 400,
          }
        );
      } else {
        await User.findOneAndUpdate(
          { _id: userId },
          { $set: { status: true } }
        );
        const entry = new Timesheet({
          userId,
          clockIn: new Date().toISOString(),
        });

        await entry.save();
        return new Response(
          JSON.stringify({ message: `Clocked In successfully` }),
          {
            status: 200,
          }
        );
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
