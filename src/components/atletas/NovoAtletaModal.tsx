"use client"
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Plan {
  id?: string;
  name: string;
}

interface Athlete {
  id: string;
  name: string;
  initials?: string;
  phone?: string;
  membershipStart?: string;
  status: string;
  plan?: { name: string };
  image?: { url: string };
  planId?: string;
}

interface NovoAtletaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (athleteData: Partial<Athlete>) => Promise<void>;
  plans: Plan[];
}

export const NovoAtletaModal: React.FC<NovoAtletaModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  plans
}) => {
  const [formData, setFormData] = useState<Partial<Athlete>>({
    name: '',
    phone: '',
    planId: '',
    membershipStart: new Date().toISOString().split('T')[0],
    status: 'ACTIVE',
  });

  const handleSubmit = async () => {
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Atleta</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Nome"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            placeholder="Telefone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <Select
            value={formData.planId}
            onValueChange={(value) => setFormData({ ...formData, planId: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um plano" />
            </SelectTrigger>
            <SelectContent>
              {plans.map((plan) => (
                <SelectItem key={plan.id || plan.name} value={plan.id || plan.name}>
                  {plan.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={formData.membershipStart}
            onChange={(e) => setFormData({ ...formData, membershipStart: e.target.value })}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NovoAtletaModal;