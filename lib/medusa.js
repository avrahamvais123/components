import Medusa from "@medusajs/medusa-js";
export const medusa = new Medusa({ baseUrl: process.env.NEXT_PUBLIC_MEDUSA_URL, maxRetries: 3 });
