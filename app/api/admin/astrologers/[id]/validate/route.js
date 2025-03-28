// app/api/admin/astrologers/[id]/reject/route.js

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/config/db";
import Astrologer from "@/models/astrologer";

export async function POST(request, { params }) {
  try {
    // 1) Connect to DB
    await dbConnect();

    // 2) Parse request body
    const { interviewDate, interviewTime } = await request.json();

    // 3) Find Astrologer by ID
    const { id } = params;
    const astrologer = await Astrologer.findById(id);

    if (!astrologer) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Astrologer not found." }),
        { status: 404, headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }
    
    // 4) Update astrologer fields
    astrologer.interviewStatus = "Scheduled"; // Or whichever status you'd prefer
    astrologer.interviewDate = interviewDate;
    astrologer.interviewTime = interviewTime;
    
    await astrologer.save();

    // 5) Return success response with CORS headers
    return new NextResponse(
      JSON.stringify({
        success: true,
        message: `Astrologer ${id} has been updated with date/time.`,
        data: {
          interviewDate: astrologer.interviewDate,
          interviewTime: astrologer.interviewTime
        }
      }),
      { status: 200, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  } catch (error) {
    console.error("Error updating astrologer:", error);
    return new NextResponse(
      JSON.stringify({ success: false, message: "Internal server error." }),
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}

// Handle OPTIONS method for CORS Preflight Requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
