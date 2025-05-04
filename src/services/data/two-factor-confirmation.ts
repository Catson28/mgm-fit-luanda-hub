// data/two-factor-confirmation.ts
import { db } from "@/services/lib/db";

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  try {
    const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
      where: { userId }
    });

    return twoFactorConfirmation;
  } catch {
    return null;
  }
};