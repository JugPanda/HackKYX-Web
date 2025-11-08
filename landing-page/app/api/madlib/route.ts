import { NextResponse } from "next/server";

import { madlibSchema, MadlibApiResponse, MadlibSuccessResponse } from "@/lib/schemas";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = madlibSchema.safeParse(payload);

    if (!parsed.success) {
      const formatted: MadlibApiResponse = {
        ok: false,
        message: "Validation failed",
        issues: parsed.error.flatten().fieldErrors,
      };
      return NextResponse.json(formatted, { status: 422 });
    }

    const data = parsed.data;

    const config: MadlibSuccessResponse["config"] = {
      schemaVersion: "1.0.0",
      characters: {
        survivor: {
          name: data.survivorName,
          codename: data.codename,
          bio: data.survivorBio,
        },
        nemesis: {
          name: data.nemesisName,
          threatLevel:
            data.difficulty === "nightmare" ? "Omega" : data.difficulty === "veteran" ? "Delta" : "Beta",
        },
      },
      world: {
        safehouse: {
          name: data.safehouseName,
          description: data.safehouseDescription,
          media: data.safehouseImage || null,
        },
        victoryCondition: data.victoryCondition,
        tone: data.tone,
        difficulty: data.difficulty,
      },
      modifiers: [
        { label: "Morale", value: data.tone === "hopeful" ? 80 : data.tone === "heroic" ? 65 : 40 },
        { label: "Risk", value: data.difficulty === "nightmare" ? 90 : data.difficulty === "veteran" ? 70 : 50 },
      ],
      lastUpdated: new Date().toISOString(),
    };

    const summary = `${data.survivorName} (${data.codename}) defends ${data.safehouseName} from ${data.nemesisName}. Win by ${data.victoryCondition.toLowerCase()}.`;

    const response: MadlibApiResponse = {
      ok: true,
      config,
      summary,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Madlib API error", error);
    const fallback: MadlibApiResponse = {
      ok: false,
      message: "Invalid JSON payload",
    };
    return NextResponse.json(fallback, { status: 400 });
  }
}
