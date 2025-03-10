import { prisma } from "../../../utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Zod Schema Validation
const testSchema = z.object({
  patientName: z.string().min(1),
  testType: z.string().min(1),
  result: z.string().min(1),
  testDate: z.string().transform((val) => {
    if (!val.includes("T")) throw new Error("Invalid datetime format");
    return val.length === 16 ? `${val}:00Z` : val; // Ensure ISO format
  }),
  notes: z.string().optional(),
});

//  Correct Parameter Handling for Next.js 15
type Params = { id: string };

// GET Test by ID
export async function GET(req: NextRequest, { params }: { params: Params }) {
  try {
    if (!params?.id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const test = await prisma.diagnosticTest.findUnique({
      where: { id: params.id },
    });

    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    return NextResponse.json(test);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch test" }, { status: 500 });
  }
}

// UPDATE Test by ID
export async function PUT(req: NextRequest, { params }: { params: Params }) {
  try {
    if (!params?.id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const body = await req.json();
    const validatedData = testSchema.parse(body);

    const updatedTest = await prisma.diagnosticTest.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        testDate: new Date(validatedData.testDate),
      },
    });

    return NextResponse.json(updatedTest);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update test" }, { status: 500 });
  }
}

// DELETE Test by ID
export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  try {
    if (!params?.id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.diagnosticTest.delete({ where: { id: params.id } });

    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Failed to delete test" }, { status: 500 });
  }
}
