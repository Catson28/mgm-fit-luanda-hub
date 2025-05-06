
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="text-center p-8">
        <h1 className="text-9xl font-heading font-bold text-mgm-blue">404</h1>
        <p className="text-2xl font-medium mb-6">Página não encontrada</p>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          Desculpe, a página que você está procurando não existe ou foi movida.
        </p>
        <Button 
          asChild
          className="bg-mgm-blue hover:bg-mgm-blue-dark"
        >
          <Link href="/">Voltar para o Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
