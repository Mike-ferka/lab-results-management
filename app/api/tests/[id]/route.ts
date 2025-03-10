import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../utils/prisma";
import { z } from "zod";

//  Schema validation
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

// GET test by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!params?.id) {
      return NextResponse.json({ error: "ID parameter is required" }, { status: 400 });
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

// UPDATE test by ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!params?.id) {
      return NextResponse.json({ error: "ID parameter is required" }, { status: 400 });
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

//  DELETE test by ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!params?.id) {
      return NextResponse.json({ error: "ID parameter is required" }, { status: 400 });
    }

    await prisma.diagnosticTest.delete({ where: { id: params.id } });

    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Failed to delete test" }, { status: 500 });
  }
}
