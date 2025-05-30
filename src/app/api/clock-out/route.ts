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
        JSON.stringify({ message: "Invalid or expired token", err }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const openEntry = await Timesheet.findOne({
      userId,
      clockOut: null,
    }).sort({ clockIn: -1 });

    if (!openEntry) {
      await User.findOneAndUpdate({ _id: userId }, { $set: { status: false } });
      return new Response(
        JSON.stringify({ message: "No active Clock-In found" }),
        {
          status: 409,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    openEntry.clockOut = new Date().toISOString();
    await openEntry.save();

    await User.findOneAndUpdate({ _id: userId }, { $set: { status: false } });

    return new Response(
      JSON.stringify({ message: "Clocked Out successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error while clocking out user", error);
    return new Response(JSON.stringify({ message: "Server Error", error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
