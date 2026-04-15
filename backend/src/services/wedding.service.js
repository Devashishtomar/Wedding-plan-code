import { getPrisma } from '../loaders/database.js';


export const createWedding = async ({ userId, data }) => {
    const prisma = getPrisma();
    // Ensure user has only ONE wedding (MVP rule)
    const existingWedding = await prisma.wedding.findFirst({
        where: { userId },
    });

    if (existingWedding) {
        const error = new Error('Wedding already exists for this user');
        error.statusCode = 409;
        throw error;
    }

    return prisma.wedding.create({
        data: {
            userId,
            date: new Date(data.date),
            location: data.location,
            budget: data.budget,
            guestCount: data.guestCount,
            weddingType: data.weddingType,
        },
    });
};

export const getMyWedding = async (userId) => {
    const prisma = getPrisma();
    return prisma.wedding.findFirst({
        where: { userId },
        include: {
            guests: true,
        },
    });
};


export const setupWeddingService = async ({ userId, data }) => {
  const prisma = getPrisma();

  const wedding = await prisma.wedding.findFirst({
    where: { userId },
  });

  if (!wedding) {
    throw new Error("Wedding not found for user");
  }

  return prisma.wedding.update({
    where: { id: wedding.id },
    data: {
      date: new Date(data.date),
      location: data.location,
      budget: data.budget,
      guestCount: data.guestCount,
      weddingType: data.weddingType,
      setupCompleted: true,
    },
  });
};

