"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const CREDIT_VALUE = 10;
const PLATFORM_FEE_PER_CREDIT = 2;
const DOCTOR_EARNINGS_PER_CREDIT = 8;

export async function requestPayout(formData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const doctor = await prisma.user.findUnique({
      where: { clerkUserId: userId, role: "DOCTOR" },
    });

    if (!doctor) {
      throw new Error("Doctor not found");
    }

    const paypalEmail = formData.get("paypalEmail");

    if (!paypalEmail) {
      throw new Error("PaPal email is required");
    }

    const existingPayout = await prisma.payout.findFirst({
      where: {
        doctorId: doctor.id,
        status: "PROCESSING",
      },
    });

    if (existingPayout) {
      throw new Error(
        "You already have a pending payout request. Please wait for it to be processed"
      );
    }

    const creditCount = doctor.credits;

    if (creditCount === 0) throw new Error("No credits available for payout");

    if (creditCount < 1)
      throw new Error("Minimun 1 credit required for payout");

    const totalAmount = creditCount * CREDIT_VALUE;
    const platformFee = creditCount * PLATFORM_FEE_PER_CREDIT;
    const netAmount = creditCount * DOCTOR_EARNINGS_PER_CREDIT;

    const payout = await prisma.payout.create({
      data: {
        doctorId: doctor.id,
        amount: totalAmount,
        credits: creditCount,
        platformFee,
        netAmount,
        paypalEmail,
        status: "PROCESSING",
      },
    });
    revalidatePath("/doctor");
    return { success: true, payout };
  } catch (error) {
    console.error("Failed to request payout:", error);
    throw new Error("Failed to request payout:  " + error.message);
  }
}

export async function getDoctorEarnings() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const doctor = await prisma.user.findUnique({
      where: { clerkUserId: userId, role: "DOCTOR" },
    });

    if (!doctor) {
      throw new Error("Doctor not found");
    }

    const completedAppointment = await prisma.appointment.findMany({
      where: { doctorId: doctor.id, status: "COMPLETED" },
    });

    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const thisMonthApps = completedAppointment.filter(
      (app) => new Date(app.createdAt) >= currentMonth
    );

    const totalEarnings = doctor.credits * DOCTOR_EARNINGS_PER_CREDIT;

    const thisMonthEarnings =
      thisMonthApps.length * 2 * DOCTOR_EARNINGS_PER_CREDIT;

    const avgEarningPerMonth =
      totalEarnings > 0
        ? totalEarnings / Math.max(1, new Date().getMonth() + 1)
        : 0;

    const availableCredits = doctor.credits;
    const availablePayout = availableCredits * DOCTOR_EARNINGS_PER_CREDIT;

    return {
      earnings: {
        totalEarnings,
        thisMonthEarnings,
        completedAppointment: completedAppointment.length,
        avgEarningPerMonth,
        availableCredits,
        availablePayout,
      },
    };
  } catch (error) {
    console.error("Failed to request payout:", error);
    throw new Error("Failed to fetch doctor earnings: " + error.message);
  }
}

export async function getDoctorPayouts() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const doctor = await prisma.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "DOCTOR",
      },
    });

    if (!doctor) {
      throw new Error("Doctor not found");
    }

    const payouts = await prisma.payout.findMany({
      where: {
        doctorId: doctor.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { payouts };
  } catch (error) {
    throw new Error("Failed to fetch payouts: " + error.message);
  }
}
