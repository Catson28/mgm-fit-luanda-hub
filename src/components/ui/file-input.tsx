"use client"

import * as React from "react"
import { cn } from "@/services/lib/utils"

interface FileInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="grid w-full gap-1.5">
        {label && <label className="text-sm font-medium">{label}</label>}
        <input
          type="file"
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
FileInput.displayName = "FileInput"

export { FileInput } 