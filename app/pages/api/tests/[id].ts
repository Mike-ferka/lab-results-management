import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const updateTestSchema = z.object({
  patientName: z.string().min(1),
  testType: z.string().min(1),
  result: z.string().min(1),
  testDate: z.string().datetime(),
  notes: z.string().optional().default(""),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  // Validate ID
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: 'Invalid test ID' });
  }

  // Handle GET
  if (req.method === 'GET') {
    try {
      const test = await prisma.diagnosticTest.findUnique({
        where: { id: Number(id) },
      });
      return test 
        ? res.status(200).json(test)
        : res.status(404).json({ error: 'Test not found' });
    } catch (error) {
      console.error('GET Error:', error);
      return res.status(500).json({ error: 'Failed to fetch test' });
    }
  }

  // Handle PUT
  if (req.method === 'PUT') {
    try {
      const validatedData = updateTestSchema.parse(req.body);
      
      const updatedTest = await prisma.diagnosticTest.update({
        where: { id: Number(id) },
        data: {
          ...validatedData,
          testDate: new Date(validatedData.testDate),
        },
      });
      
      return res.status(200).json(updatedTest);
    } catch (error) {
      console.error('PUT Error:', error);
      return res.status(400).json({ 
        error: 'Invalid input',
        details: error instanceof z.ZodError ? error.errors : null
      });
    }
  }

  // Handle DELETE
  if (req.method === 'DELETE') {
    try {
      await prisma.diagnosticTest.delete({
        where: { id: Number(id) },
      });
      return res.status(204).end();
    } catch (error) {
      console.error('DELETE Error:', error);
      return res.status(500).json({ error: 'Failed to delete test' });
    }
  }

  // Handle other methods
  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}