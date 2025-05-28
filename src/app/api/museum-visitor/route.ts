/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json(); // use req.json() to get the request body

    function countVisits(input: string) {
      const initialCount = { M: 0, W: 0, C: 0 };

      for (const char of input) {
        if (initialCount.hasOwnProperty(char)) {
          initialCount[char]++;
        }
      }
      //   console.log("::::::::::", initialCount)

      // Sorting the object
      const sorted = Object.entries(initialCount)
        .filter(([_, value]) => value > 0)
        .sort((a, b) => {
          if (b[1] === a[1]) {
            const priority = { M: 1, W: 2, C: 3 };
            return priority[a[0]] - priority[b[0]];
          }
          return b[1] - a[1];
        });

      const finalString = sorted
        .map(([char, value]) => `${value}${char}`)
        .join("");

      return finalString;
    }

    const result = countVisits(input);
    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error parsing request:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Invalid JSON" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
