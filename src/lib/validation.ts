import { z } from "zod";

// Schema de validação para login
export const loginSchema = z.object({
  email: z
    .string()
    .email("Email inválido")
    .min(1, "Email é obrigatório")
    .max(254, "Email muito longo"),
  password: z
    .string()
    .min(6, "Password deve ter pelo menos 6 caracteres")
    .max(128, "Password muito longa")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password deve conter pelo menos uma letra minúscula, uma maiúscula e um número"
    ),
});

// Schema para criação/edição de utilizador
export const userSchema = z
  .object({
    id: z.string().optional(),
    name: z
      .string()
      .min(2, "Nome deve ter pelo menos 2 caracteres")
      .max(100, "Nome muito longo")
      .regex(/^[a-zA-ZÀ-ÿ\s]*$/, "Nome deve conter apenas letras e espaços"),
    email: z.string().email("Email inválido").max(254, "Email muito longo"),
    role: z.enum(["admin", "manager", "salesperson"], {
      errorMap: () => ({ message: "Papel inválido" }),
    }),
    password: z
      .string()
      .min(6, "Password deve ter pelo menos 6 caracteres")
      .max(128, "Password muito longa")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password deve conter pelo menos uma letra minúscula, uma maiúscula e um número"
      )
      .optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.password && data.confirmPassword) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords não coincidem",
      path: ["confirmPassword"],
    }
  );

// Schema para leads
export const leadSchema = z.object({
  id: z.string().optional(),
  nome: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome muito longo")
    .regex(/^[a-zA-ZÀ-ÿ\s]*$/, "Nome deve conter apenas letras e espaços"),
  empresa: z
    .string()
    .min(2, "Nome da empresa deve ter pelo menos 2 caracteres")
    .max(100, "Nome da empresa muito longo"),
  email: z
    .string()
    .email("Email inválido")
    .max(254, "Email muito longo")
    .optional()
    .or(z.literal("")),
  telefone: z
    .string()
    .regex(/^[\+]?[0-9\s\-\(\)]*$/, "Telefone inválido")
    .max(20, "Telefone muito longo")
    .optional()
    .or(z.literal("")),
  valor: z
    .number()
    .min(0, "Valor deve ser positivo")
    .max(999999999, "Valor muito alto"),
  status: z.enum([
    "novo",
    "contactado",
    "qualificado",
    "proposta",
    "negociacao",
    "ganho",
    "perdido",
  ]),
  origem: z.enum([
    "Site",
    "Referência",
    "LinkedIn",
    "Email",
    "Feira",
    "Google",
    "Outro",
  ]),
  notas: z
    .string()
    .max(1000, "Notas muito longas")
    .optional()
    .or(z.literal("")),
  responsavelId: z.string().min(1, "Responsável é obrigatório"),
});

// Schema para tarefas
export const taskSchema = z.object({
  id: z.string().optional(),
  titulo: z
    .string()
    .min(3, "Título deve ter pelo menos 3 caracteres")
    .max(100, "Título muito longo"),
  descricao: z
    .string()
    .max(500, "Descrição muito longa")
    .optional()
    .or(z.literal("")),
  prazo: z.string().min(1, "Data de prazo é obrigatória"),
  status: z.enum(["pendente", "em_progresso", "concluida", "cancelada"]),
  prioridade: z.enum(["baixa", "media", "alta", "urgente"]),
  responsavelId: z.string().min(1, "Responsável é obrigatório"),
  leadId: z.string().optional(),
});

// Schema para configurações da empresa
export const companySettingsSchema = z.object({
  companyName: z
    .string()
    .min(2, "Nome da empresa deve ter pelo menos 2 caracteres")
    .max(100, "Nome da empresa muito longo"),
  companyEmail: z
    .string()
    .email("Email inválido")
    .max(254, "Email muito longo"),
  companyDomain: z
    .string()
    .min(3, "Domínio deve ter pelo menos 3 caracteres")
    .max(100, "Domínio muito longo")
    .regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Domínio inválido"),
  primaryColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Cor inválida"),
  secondaryColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Cor inválida"),
  accentColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Cor inválida"),
  logoUrl: z.string().url("URL inválida").optional().or(z.literal("")),
});

// Função helper para validar dados
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): {
  success: boolean;
  data?: T;
  errors?: string[];
} {
  try {
    const result = schema.safeParse(data);

    if (result.success) {
      return {
        success: true,
        data: result.data,
      };
    } else {
      return {
        success: false,
        errors: result.error.errors.map((err) => err.message),
      };
    }
  } catch (error) {
    return {
      success: false,
      errors: ["Erro de validação inesperado"],
    };
  }
}

// Tipos TypeScript derivados dos schemas
export type LoginData = z.infer<typeof loginSchema>;
export type UserData = z.infer<typeof userSchema>;
export type LeadData = z.infer<typeof leadSchema>;
export type TaskData = z.infer<typeof taskSchema>;
export type CompanySettingsData = z.infer<typeof companySettingsSchema>;
