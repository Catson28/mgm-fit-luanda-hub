// schemas/index.ts
import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email inválido",
  }),
  password: z.string().min(1, {
    message: "Senha é obrigatória",
  }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email inválido",
  }),
  password: z.string().min(6, {
    message: "Mínimo de 6 caracteres",
  }),
  name: z.string().min(1, {
    message: "Nome é obrigatório",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email inválido",
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Mínimo de 6 caracteres",
  }),
});