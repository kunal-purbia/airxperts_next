/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Timesheet } from "@/models/Timesheet";
import { User } from "@/models/User";
import { getISOWeek } from "date-fns";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const userId = req.nextUrl.searchParams.get("userId");
    if (userId) {
      const user = await User.findOne({ _id: userId });
      if (!user) {
        return new Response("User Not Found", {
          status: 404,
        });
      }
      const entries = await Timesheet.find({
        userId,
      }).sort({ clockIn: -1 });

      const summary: any = {};

      for (const entry of entries) {
        const { clockIn, clockOut } = entry;
        if (!clockOut) continue;

        const date = new Date(clockIn);
        const week = `Week ${getISOWeek(date)}`;
        const day = date.toISOString().split("T")[0];
        const hours =
          (new Date(clockOut).getTime() - new Date(clockIn).getTime()) /
          (1000 * 60 * 60);

        if (!summary[week]) summary[week] = {};
        if (!summary[week][day]) summary[week][day] = 0;

        summary[week][day] += hours;
      }

      return new Response(JSON.stringify({ summary }), {
        status: 200,
      });
    }
  } catch (error) {
    console.error("Error while fetching summary of user", error);
    return new Response(JSON.stringify({ success: false, error }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
