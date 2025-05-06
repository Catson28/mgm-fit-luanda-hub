// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { v4 as uuidv4 } from "uuid";
import path from "path";

// Definindo a interface para o resultado do upload do Cloudinary
interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  [key: string]: any; // Para outras propriedades que podem existir no resultado
}

// Configuração do Cloudinary (já feita em lib/cloudinary.ts, mas mantida aqui para referência)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo fornecido" },
        { status: 400 }
      );
    }
    
    // Verificar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "O arquivo deve ser uma imagem" },
        { status: 400 }
      );
    }
    
    // Converter o arquivo para buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${uuidv4()}${path.extname(file.name)}`;
    
    // Fazer upload para o Cloudinary
    const uploadResult = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          public_id: filename, // Nome do arquivo no Cloudinary
          folder: "uploads", // Pasta no Cloudinary (opcional)
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as CloudinaryUploadResult);
        }
      );
      stream.end(buffer);
    });

    return NextResponse.json({
      url: uploadResult.secure_url, // URL da imagem no Cloudinary
      publicId: uploadResult.public_id, // ID público para manipular a imagem depois
    });
  } catch (error) {
    console.error("Erro ao processar upload:", error);
    return NextResponse.json(
      { error: "Erro ao processar upload" },
      { status: 500 }
    );
  }
}