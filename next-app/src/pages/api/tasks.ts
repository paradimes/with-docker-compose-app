import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import { revalidatePath } from "next/cache";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const task = await prisma.task.create({
        data: {
          title: req.body.title,
        },
      });
      return res.status(201).json(task);
    } catch (error) {
      return res.status(500).json({ error: "Error creating task" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const taskId = parseInt(req.query.id as string);
      await prisma.task.delete({
        where: {
          id: taskId,
        },
      });
      return res.status(200).json({ message: "Task deleted" });
    } catch (error) {
      return res.status(500).json({ error: "Error deleting task" });
    }
  }

  if (req.method === "GET") {
    try {
      const tasks = await prisma.task.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });
      return res.status(200).json(tasks);
    } catch (error) {
      return res.status(500).json({ error: "Error fetching tasks" });
    }
  }

  revalidatePath("/");
  return res.status(405).json({ error: "Method not allowed" });
}
