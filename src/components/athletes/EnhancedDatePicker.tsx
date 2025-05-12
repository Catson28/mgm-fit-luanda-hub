import { useCallback } from "react";
import { CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import DatePicker, { ReactDatePickerCustomHeaderProps } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ControllerRenderProps, FieldValues, Path } from "react-hook-form";

// Interface para o input personalizado do DatePicker
interface CustomDatePickerInputProps {
  value: string;
  onClick: () => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: (event: React.MouseEvent<HTMLButtonElement>) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  // Substituímos o index signature por props específicas mais comuns
  id?: string;
  name?: string;
  "aria-label"?: string;
  tabIndex?: number;
}

// Componente personalizado para input do DatePicker
const CustomDatePickerInput = ({
  value,
  onClick,
  onChange,
  onClear,
  ...props
}: CustomDatePickerInputProps) => (
  <div className="relative w-full">
    <Input
      value={value}
      onClick={onClick}
      onChange={onChange}
      className="pl-3 pr-12 cursor-pointer"
      readOnly
      {...props}
    />
    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={onClear}
        >
          <X className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
        </Button>
      )}
      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
    </div>
  </div>
);

// Interface para o cabeçalho personalizado do DatePicker usando a interface da biblioteca
type CustomDatePickerHeaderProps = ReactDatePickerCustomHeaderProps;

// Componente personalizado para cabeçalho do calendário
const CustomDatePickerHeader = ({
  date,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}: CustomDatePickerHeaderProps) => (
  <div className="flex justify-between items-center px-2 py-1.5">
    <Button
      onClick={decreaseMonth}
      disabled={prevMonthButtonDisabled}
      variant="ghost"
      size="sm"
      className="h-7 w-7 p-0"
    >
      <ChevronLeft className="h-4 w-4" />
    </Button>

    <span className="text-sm font-medium">
      {format(date, "MMMM yyyy", { locale: ptBR })}
    </span>

    <Button
      onClick={increaseMonth}
      disabled={nextMonthButtonDisabled}
      variant="ghost"
      size="sm"
      className="h-7 w-7 p-0"
    >
      <ChevronRight className="h-4 w-4" />
    </Button>
  </div>
);

// Interface para as propriedades do EnhancedDatePicker
interface EnhancedDatePickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>
> {
  field: ControllerRenderProps<TFieldValues, TName>;
}

// Type para ModifierProps do react-datepicker
type DatePickerModifier = {
  name: string;
  options?: Record<string, unknown>;
  fn: (state: Record<string, unknown>) => Record<string, unknown>;
};

// Componente DatePicker melhorado
export function EnhancedDatePicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>
>({ field }: EnhancedDatePickerProps<TFieldValues, TName>) {
  // Função para limpar a data
  const handleClearDate = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Impede o click event de abrir o DatePicker
    field.onChange(null);
  }, [field]);

  return (
    <DatePicker
      selected={field.value as Date | null}
      onChange={(date: Date | null) => field.onChange(date)}
      dateFormat="dd/MM/yyyy"
      locale={ptBR}
      placeholderText="Selecione uma data"
      customInput={
        <CustomDatePickerInput
          value={field.value ? format(field.value as Date, 'dd/MM/yyyy') : ''}
          onClick={() => { }}
          onChange={() => { }}
          onClear={handleClearDate}
        />
      }
      renderCustomHeader={(props) => <CustomDatePickerHeader {...props} />}
      showYearDropdown
      showMonthDropdown
      dropdownMode="select"
      yearDropdownItemNumber={15}
      className="w-full"
      popperClassName="react-datepicker-popper z-50"
      popperPlacement="bottom-start"
      popperModifiers={[
        {
          name: "offset",
          options: {
            offset: [0, 8]
          },
          fn: (state: Record<string, unknown>) => state
        }
      ] as DatePickerModifier[]}
      todayButton="Hoje"
      calendarClassName="bg-popover border border-border rounded-md shadow-md px-1.5 py-2"
      dayClassName={(date: Date) =>
        cn(
          "mx-0.5 rounded hover:bg-accent/70 transition-colors text-sm",
          field.value && date.getTime() === (field.value as Date).getTime()
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "hover:bg-accent"
        )
      }
      wrapperClassName="w-full"
    />
  );
}