/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Timesheet } from "@/models/Timesheet";
import { User } from "@/models/User";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];
    const secret = process.env.JWT_SECRET as string;

    if (!token) {
      return new Response(JSON.stringify({ message: "Token missing" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    let userId: string;
    try {
      const decoded = jwt.verify(token, secret) as { userId: string };
      userId = decoded.userId;
    } catch (err) {
      return new Response(
        JSON.stringify({ message: "Invalid or expired token" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const checkOpenEntry = await Timesheet.findOne({
      userId,
      clockOut: null,
    });

    // Update user status to 'clocked in'
    await User.findOneAndUpdate({ _id: userId }, { $set: { status: true } });

    if (checkOpenEntry) {
      return new Response(
        JSON.stringify({ message: "Active Clock-In is present" }),
        {
          status: 409,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const entry = new Timesheet({
      userId,
      clockIn: new Date().toISOString(),
    });

    await entry.save();

    return new Response(
      JSON.stringify({ message: "Clocked In successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error while clocking in user", error);
    return new Response(JSON.stringify({ message: "Server error", error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
