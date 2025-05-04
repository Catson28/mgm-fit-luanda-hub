```tsx
// Estrutura de pastas e arquivos principais para o projeto:

// src/
// ├── app/
// │   ├── page.tsx             // Página principal
// │   ├── layout.tsx           // Layout principal
// │   └── globals.css          // Estilos globais
// ├── components/
// │   ├── ui/                  // Componentes do shadcn/ui
// │   ├── file-upload.tsx      // Componente de upload de arquivo
// │   ├── header.tsx           // Cabeçalho da aplicação
// │   ├── saft-viewer.tsx      // Visualizador principal do SAF-T
// │   ├── saft-header.tsx      // Visualizador da seção Header
// │   ├── saft-master-files.tsx  // Visualizador da seção MasterFiles
// │   ├── saft-source-docs.tsx   // Visualizador da seção SourceDocuments
// │   └── edit-forms/           // Formulários para edição de cada seção
// │       ├── header-form.tsx
// │       ├── supplier-form.tsx
// │       └── invoice-form.tsx
// ├── lib/
// │   ├── saft-parser.ts       // Parser do XML SAF-T
// │   ├── saft-generator.ts    // Gerador do XML SAF-T
// │   └── utils.ts             // Funções utilitárias
// └── types/
//     └── saft.ts              // Tipos para o formato SAF-T AO
```

```tsx
// Estrutura do projeto
/*
saft-xml-manager/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   ├── api/
│   │   └── parse-xml/route.ts
├── components/
│   ├── ui/ (componentes shadcn)
│   ├── file-uploader.tsx
│   ├── xml-viewer.tsx
│   ├── header.tsx
│   ├── sidebar.tsx
│   ├── data-form.tsx
│   ├── export-button.tsx
│   └── theme-provider.tsx
├── lib/
│   ├── utils.ts
│   └── xml-utils.ts
├── types/
│   └── saft.ts
├── public/
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
*/
```
