// components/ui/upload-image.tsx
import { useState, useCallback } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";

interface UploadImageProps {
  onChange: (file: File | null) => void;
  value?: string;
}

export function UploadImage({ onChange, value }: UploadImageProps) {
  const [preview, setPreview] = useState<string | null>(value || null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        onChange(file);
      }
    },
    [onChange]
  );

  const handleRemove = useCallback(() => {
    setPreview(null);
    onChange(null);
  }, [onChange]);

  return (
    <div className="w-full">
      {preview ? (
        <Card className="relative overflow-hidden w-40 h-40">
          <Image
            src={preview}
            alt="Preview"
            className="object-cover"
            fill
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </Card>
      ) : (
        <label htmlFor="image-upload">
          <Card className="border-dashed flex items-center justify-center w-40 h-40 cursor-pointer hover:opacity-70 transition">
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-10 w-10 text-gray-400" />
              <span className="text-xs text-gray-500">Upload imagem</span>
            </div>
          </Card>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      )}
    </div>
  );
}