/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    await connectDB();

    // input validation
    if (!email || !password) {
      return new Response("Missing required information", {
        status: 400,
      });
    }

    // Check if user exists
    const userCheck = await User.findOne({ email });
    if (!userCheck)
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });

    const isAuthentic = await bcrypt.compare(password, userCheck.password);

    if (!isAuthentic) {
      return new Response(JSON.stringify({ message: "Incorrect Password" }), {
        status: 401,
      });
    } else {
      const token = jwt.sign(
        { userId: userCheck._id },
        process.env.NEXT_PUBLIC_JWT_SECRET,
        { expiresIn: "1d" }
      );
      return new Response(
        JSON.stringify({
          message: "Login successful",
          token,
          userId: userCheck._id,
        }),
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    console.error("Error while registering user:", error);
    return new Response(JSON.stringify({ success: false, error }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
