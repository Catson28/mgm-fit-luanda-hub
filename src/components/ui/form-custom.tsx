"use client"
import { Label } from "@/components/ui/label";
import { useFormField, FormItemContext } from "@/components/ui/form"
import { createContext, useContext } from "react";

// Este é um componente personalizado para resolver o problema com FormLabel
export function FormLabel({ className, ...props }) {
  // Use try/catch para evitar erros de renderização no servidor
  try {
    const { error, formItemId } = useFormField()

    return (
      <Label
        className={className}
        htmlFor={formItemId}
        {...props}
      />
    )
  } catch (e) {
    // Fallback para renderização no servidor
    return <Label className={className} {...props} />
  }
}

// Se você precisar de um FormDescription personalizado também
export function FormDescription({ className, ...props }) {
  try {
    const { formDescriptionId } = useFormField()

    return (
      <p
        id={formDescriptionId}
        className={className}
        {...props}
      />
    )
  } catch (e) {
    return <p className={className} {...props} />
  }
}

// Componente de wrapper para garantir que components do Form serão usados apropriadamente
export function FormWrapper({ children }) {
  return <>{children}</>
}