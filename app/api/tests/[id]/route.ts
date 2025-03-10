import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../utils/prisma";
import { z } from "zod";

const testSchema = z.object({
  patientName: z.string().min(1),
  testType: z.string().min(1),
  result: z.string().min(1),
  testDate: z.string().transform((val) => {
    if (!val.includes("T")) throw new Error("Invalid datetime format");

    // Ensure it ends with seconds and 'Z' for UTC
    return val.length === 16 ? `${val}:00Z` : val;
  }),
  notes: z.string().optional(),
});

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    const test = await prisma.diagnosticTest.findUnique({
      where: { id },
    });

    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    return NextResponse.json(test);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch test" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    const body = await req.json();
    const validatedData = testSchema.parse(body);

    const updatedTest = await prisma.diagnosticTest.update({
      where: { id },
      data: {
        ...validatedData,
        testDate: new Date(validatedData.testDate),
      },
    });

    return NextResponse.json(updatedTest);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update test" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    await prisma.diagnosticTest.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete test" },
      { status: 500 }
    );
  }
}
