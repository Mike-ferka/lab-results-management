import { prisma } from "../../../utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

const testSchema = z.object({
  patientName: z.string().min(1),
  testType: z.string().min(1),
  result: z.string().min(1),
  testDate: z.string().transform((val) => {
    if (!val.includes("T")) throw new Error("Invalid datetime format");
    return val.length === 16 ? `${val}:00Z` : val;
  }),
  notes: z.string().optional(),
});

// ✅ GET handler (get test by ID)
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const test = await prisma.diagnosticTest.findUnique({
      where: { id: Number(params.id) },
    });

    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }
    
    return NextResponse.json(test);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch test" },
      { status: 500 }
    );
  }
}

// ✅ PUT handler (update test by ID)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validatedData = testSchema.parse(body);

    const updatedTest = await prisma.diagnosticTest.update({
      where: { id: Number(params.id) },
      data: {
        ...validatedData,
        testDate: new Date(validatedData.testDate),
      },
    });

    return NextResponse.json(updatedTest);
  } catch (error) {
    if (error instanceof ZodError) {
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

// ✅ DELETE handler (delete test by ID)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.diagnosticTest.delete({
      where: { id: Number(params.id) },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete test" },
      { status: 500 }
    );
  }
}