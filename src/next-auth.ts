// Defina o tipo ExtendedUser aqui
export type ExtendedUser = {
  id: string;
  name: string | null;
  email: string | null;
  role: string; // Exemplo: "admin", "user", etc.
  isTwoFactorEnabled: boolean;
  // Outros campos personalizados...
};