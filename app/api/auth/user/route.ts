import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { dbClient } from "@/lib/db/client";

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    
    if (!user) {
      return NextResponse.json(null, { status: 401 });
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImageUrl: user.profileImageUrl,
      subscriptionTier: user.subscriptionTier,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(null, { status: 401 });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getAuthenticatedUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updates = await req.json();
    const allowedFields = ["firstName", "lastName"];
    const filteredUpdates: Record<string, string> = {};
    
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    }

    const updatedUser = await dbClient.users.update(user.id, filteredUpdates);
    
    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      profileImageUrl: updatedUser.profileImageUrl,
      subscriptionTier: updatedUser.subscriptionTier,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
