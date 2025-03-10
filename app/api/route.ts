import { NextRequest, NextResponse } from "next/server"
import {prisma} from "../utils/prisma"
import {z, ZodError} from "zod"
export async function GET(){
    const users=await prisma.diagnosticTest.findMany();
    return NextResponse.json({users})
}

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

export async function POST(req: NextRequest){
    try{
        const body = await req.json();
    console.log(body)
    const data=testSchema.parse(body)

    await prisma.diagnosticTest.create({
        data:{ patientName:data.patientName,
            testType:data.testType,
            result:data.result,
            testDate:data.testDate,
            notes:data.notes

        }
    })
    return NextResponse.json({body})
    }
    catch(error){
        if (error instanceof ZodError){
            const zodErrors=JSON.parse(error.message);
            return NextResponse.json({error:zodErrors[0].message},{status:400});
        }

        return NextResponse.json({error:"Something went wrong"},{status:500});

    }
    
}

