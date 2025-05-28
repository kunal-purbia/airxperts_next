/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    await connectDB();

    // input validation
    if (!name || !email || !password) {
      return new Response("Missing required information", {
        status: 400,
      });
    }

    // Check if user exists
    const userCheck = await User.findOne({ email });
    if (userCheck)
      return new Response("User already exists", {
        status: 400,
      });

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ name, email, password: hashPassword });

    return new Response(`User created successfully -  ${newUser}`, {
      status: 201,
    });
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
