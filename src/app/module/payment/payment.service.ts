import { PaymentStatus } from "../../../../generated/prisma/enums";
import config from "../../config";
import { getBkashIdToken } from "../../lib/bkash";
import { prisma } from "../../lib/prisma";
import { RequestUser } from "../../middleware/checkAuth";
import { ICreatePaymentInput, IPayPaymentInput } from "./payment.interface";


const createPayment = async (payload: ICreatePaymentInput, user: RequestUser) => {
  return await prisma.$transaction(async (tx) => {
    const bkashIdToken = await getBkashIdToken();

    if (!bkashIdToken) {
      throw new Error("No bkash access token found");
    }

    const payerRef = payload.payerReference || user.email;

    
    const initialPayment = await tx.payment.create({
      data: {
        userId: user.id,
        amount: payload.amount,
        status: PaymentStatus.PENDING,
        payerReference: payerRef,
        merchantInvoiceNumber: `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      },
    });

    const bkashCreatePaymentResponse = await fetch(
      `${config.bkash_base_url}/tokenized/checkout/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: bkashIdToken,
          "X-App-Key": config.bkash_app_key,
        },
        body: JSON.stringify({
          mode: "0011",
          payerReference: payerRef,
          callbackURL: `${config.bkash_callback_url}/payments/bkash/callback`,
          amount: payload.amount.toString(),
          currency: "BDT",
          intent: "sale",
          merchantInvoiceNumber: initialPayment.merchantInvoiceNumber,
        }),
      }
    );

    const bkashCreatePaymentResult = await bkashCreatePaymentResponse.json();

    const updatedPayment = await tx.payment.update({
      where: { id: initialPayment.id },
      data: {
        gatewayResponse: bkashCreatePaymentResult,
        bkashPaymentId: bkashCreatePaymentResult.paymentID,
      },
    });

    return {
      paymentUrl: bkashCreatePaymentResult.bkashURL,
      payment: updatedPayment,
    };
  });
};


const payPayment = async (payload: IPayPaymentInput, user: RequestUser) => {
  const existingPayment = await prisma.payment.findUnique({
    where: { id: payload.paymentId },
  });

  if (!existingPayment) {
    throw new Error("Payment record does not exist.");
  }

  if (existingPayment.status !== PaymentStatus.PENDING) {
    throw new Error("Only PENDING payments can be processed.");
  }

  const bkashIdToken = await getBkashIdToken();

  if (!bkashIdToken) {
    throw new Error("No bkash access token found");
  }

  const payerRef = existingPayment.payerReference || user.email;

  const bkashCreatePaymentResponse = await fetch(
    `${config.bkash_base_url}/tokenized/checkout/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: bkashIdToken,
        "X-App-Key": config.bkash_app_key,
      },
      body: JSON.stringify({
        mode: "0011",
        payerReference: payerRef,
        callbackURL: `${config.bkash_callback_url}/payments/bkash/callback`,
        amount: existingPayment.amount.toString(),
        currency: "BDT",
        intent: "sale",
        merchantInvoiceNumber: existingPayment.merchantInvoiceNumber,
      }),
    }
  );

  const bkashCreatePaymentResult = await bkashCreatePaymentResponse.json();

  await prisma.payment.update({
    where: { id: existingPayment.id },
    data: {
      gatewayResponse: bkashCreatePaymentResult,
      bkashPaymentId: bkashCreatePaymentResult.paymentID,
    },
  });

  return {
    paymentUrl: bkashCreatePaymentResult.bkashURL,
  };
};


const bkashCallback = async (query: Record<string, any>) => {
  return await prisma.$transaction(async (tx) => {
    const paymentId = query.paymentID;
    const status = query.status;

    if (!paymentId) throw new Error("PaymentID is missing");
    if (!status) throw new Error("Status is missing");

    const bkashIdToken = await getBkashIdToken();

    if (!bkashIdToken) {
      throw new Error("No bkash access token found");
    }

    const executedPaymentResponse = await fetch(
      `${config.bkash_base_url}/tokenized/checkout/execute`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: bkashIdToken,
          "X-App-Key": config.bkash_app_key,
        },
        body: JSON.stringify({ paymentID: paymentId }),
      }
    );

    const executedPaymentResult = await executedPaymentResponse.json();

    if (status === "success") {
      await tx.payment.update({
        where: { bkashPaymentId: paymentId },
        data: {
          status: PaymentStatus.PAID,
          bkashTrxId: executedPaymentResult.trxID,
          paidAt: executedPaymentResult.paymentExecutedTime,
          gatewayResponse: executedPaymentResult,
        },
      });

      return {
        redirectUrl: `${config.frontend_url}/dashboard/my-payments?status=success`,
      };
    } else if (status === "failure") {
      await tx.payment.update({
        where: { bkashPaymentId: paymentId },
        data: {
          status: PaymentStatus.FAILED,
          gatewayResponse: executedPaymentResult,
        },
      });

      return {
        redirectUrl: `${config.frontend_url}/dashboard/my-payments?status=failure`,
      };
    } else if (status === "cancel") {
      await tx.payment.update({
        where: { bkashPaymentId: paymentId },
        data: {
          status: PaymentStatus.CANCELLED,
          gatewayResponse: executedPaymentResult,
        },
      });

      return {
        redirectUrl: `${config.frontend_url}/dashboard/my-payments?status=cancel`,
      };
    } else {
      return {
        redirectUrl: `${config.frontend_url}/dashboard/my-payments?error=payment-failed`,
      };
    }
  });
};


const getMyPayments = async (userId: string) => {
  return await prisma.payment.findMany({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const PaymentServices = {
  createPayment,
  payPayment,
  bkashCallback,
  getMyPayments,
};