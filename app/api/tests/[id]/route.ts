import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../utils/prisma";
import { z, ZodError } from "zod";

// Schema for validating diagnostic test data
const testSchema = z.object({
  patientName: z.string().min(1, "Patient name is required"),
  testType: z.string().min(1, "Test type is required"),
  result: z.string().min(1, "Result is required"),
  testDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  notes: z.string().optional(),
});

// Type for the params object
interface Params {
  id: string;
}

// GET handler to fetch a specific test by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> } // `params` is now a Promise
) {
  try {
    const resolvedParams = await params; // Await the params Promise
    const test = await prisma.diagnosticTest.findUnique({
      where: { id: resolvedParams.id }, // Use the resolved `id`
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

// PUT handler to update a test by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<Params> } // `params` is now a Promise
) {
  try {
    const resolvedParams = await params; // Await the params Promise
    const body = await request.json();
    const data = testSchema.parse(body);

    const updatedTest = await prisma.diagnosticTest.update({
      where: { id: resolvedParams.id }, // Use the resolved `id`
      data: {
        patientName: data.patientName,
        testType: data.testType,
        result: data.result,
        testDate: new Date(data.testDate), // Ensure testDate is a Date object
        notes: data.notes,
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

// DELETE handler to delete a test by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<Params> } // `params` is now a Promise
) {
  try {
    const resolvedParams = await params; // Await the params Promise
    await prisma.diagnosticTest.delete({
      where: { id: resolvedParams.id }, // Use the resolved `id`
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete test" },
      { status: 500 }
    );
  }
}