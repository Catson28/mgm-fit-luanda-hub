"use client"
import { Label } from "@/components/ui/label";
import { useFormField } from "@/components/ui/form"
import { ReactNode } from "react";
import { LabelProps } from "@radix-ui/react-label";
import { HTMLAttributes } from "react";

export function FormLabel({ className, ...props }: LabelProps) {
  const formField = useFormField();
  const formItemId = formField?.formItemId;

  return (
    <Label
      className={className}
      htmlFor={formItemId}
      {...props}
    />
  );
}

export function FormDescription({ 
  className, 
  ...props 
}: HTMLAttributes<HTMLParagraphElement>) {
  const formField = useFormField();
  const formDescriptionId = formField?.formDescriptionId;

  return (
    <p
      id={formDescriptionId}
      className={className}
      {...props}
    />
  );
}

interface FormWrapperProps {
  children: ReactNode;
}

export function FormWrapper({ children }: FormWrapperProps) {
  return <>{children}</>
}