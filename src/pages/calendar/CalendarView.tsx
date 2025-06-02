import React, { useState, useEffect } from "react";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
  isSameDay,
  isSameMonth,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
} from "lucide-react";
import { getEventosByData } from "@/services/mockData";
import { Evento } from "@/types/models";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type CalendarViewMode = "month" | "week" | "day";

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<CalendarViewMode>("month");
  const [events, setEvents] = useState<Evento[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    // Carregar eventos com base no modo de visualização e data selecionada
    let startDate: Date;
    let endDate: Date;

    switch (viewMode) {
      case "day":
        startDate = new Date(selectedDate);
        endDate = new Date(selectedDate);
        break;
      case "week":
        startDate = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Segunda-feira
        endDate = endOfWeek(selectedDate, { weekStartsOn: 1 }); // Domingo
        break;
      case "month":
      default:
        startDate = startOfMonth(selectedDate);
        endDate = endOfMonth(selectedDate);
        break;
    }

    setEvents(getEventosByData(startDate, endDate));
  }, [selectedDate, viewMode]);

  // Funções de navegação
  const goToNextPeriod = () => {
    let newDate: Date;

    switch (viewMode) {
      case "day":
        newDate = addDays(selectedDate, 1);
        break;
      case "week":
        newDate = addDays(selectedDate, 7);
        break;
      case "month":
      default: {
        const nextMonth = selectedDate.getMonth() + 1;
        newDate = new Date(selectedDate.getFullYear(), nextMonth, 1);
        break;
      }
    }

    setSelectedDate(newDate);
  };

  const goToPreviousPeriod = () => {
    let newDate: Date;

    switch (viewMode) {
      case "day":
        newDate = addDays(selectedDate, -1);
        break;
      case "week":
        newDate = addDays(selectedDate, -7);
        break;
      case "month":
      default: {
        const prevMonth = selectedDate.getMonth() - 1;
        newDate = new Date(selectedDate.getFullYear(), prevMonth, 1);
        break;
      }
    }

    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  // Renderizar o calendário de acordo com o modo de visualização
  const renderCalendar = () => {
    switch (viewMode) {
      case "day":
        return <DayView date={selectedDate} events={events} />;
      case "week":
        return <WeekView date={selectedDate} events={events} />;
      case "month":
      default:
        return <MonthView date={selectedDate} events={events} />;
    }
  };

  // Formatar título do período
  const getPeriodTitle = () => {
    switch (viewMode) {
      case "day":
        return format(selectedDate, "EEEE, d 'de' MMMM yyyy", { locale: ptBR });
      case "week": {
        const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
        const end = endOfWeek(selectedDate, { weekStartsOn: 1 });

        if (start.getMonth() === end.getMonth()) {
          return `${format(start, "d", { locale: ptBR })} - ${format(
            end,
            "d 'de' MMMM yyyy",
            { locale: ptBR }
          )}`;
        } else if (start.getFullYear() === end.getFullYear()) {
          return `${format(start, "d 'de' MMMM", { locale: ptBR })} - ${format(
            end,
            "d 'de' MMMM yyyy",
            { locale: ptBR }
          )}`;
        } else {
          return `${format(start, "d 'de' MMMM yyyy", {
            locale: ptBR,
          })} - ${format(end, "d 'de' MMMM yyyy", { locale: ptBR })}`;
        }
      }
      case "month":
      default:
        return (
          format(selectedDate, "MMMM yyyy", { locale: ptBR })
            .charAt(0)
            .toUpperCase() +
          format(selectedDate, "MMMM yyyy", { locale: ptBR }).slice(1)
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Calendário</h1>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <Button onClick={() => { goToToday(); }}>Hoje</Button>          <Tabs
            value={viewMode}
            onValueChange={(value) => { setViewMode(value as CalendarViewMode); }}
          >
            <TabsList>
              <TabsTrigger value="day">Dia</TabsTrigger>
              <TabsTrigger value="week">Semana</TabsTrigger>
              <TabsTrigger value="month">Mês</TabsTrigger>
            </TabsList>
          </Tabs>

          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">
                  {format(selectedDate, "dd/MM/yyyy")}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    setSelectedDate(date);
                    setIsCalendarOpen(false);
                  }
                }}
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Filtros</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Todos os eventos</DropdownMenuItem>
              <DropdownMenuItem>Meus eventos</DropdownMenuItem>
              <DropdownMenuItem>Reuniões</DropdownMenuItem>
              <DropdownMenuItem>Apresentações</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button>
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Novo Evento</span>
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium">{getPeriodTitle()}</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={goToPreviousPeriod}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={goToNextPeriod}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="bg-white border rounded-md shadow-sm overflow-hidden">
        {renderCalendar()}
      </div>
    </div>
  );
};

const MonthView = ({ date, events }: { date: Date; events: Evento[] }) => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const dayNames = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

  // Preparar a grade do calendário
  const rows = [];
  let days = [];

  let day = startDate;
  let formattedDate = "";

  // Criar dias do calendário
  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, "d");
      const isToday = isSameDay(day, new Date());
      const isCurrentMonth = isSameMonth(day, monthStart);

      // Filtrar eventos para este dia
      const dayEvents = events.filter((event) =>
        isSameDay(new Date(event.dataInicio), day)
      );

      days.push(
        <div
          key={day.toString()}
          className={`h-32 sm:h-36 border-r border-b p-1 ${
            !isCurrentMonth ? "bg-gray-50 text-gray-400" : "bg-white"
          } ${isToday ? "bg-blue-50" : ""}`}
        >
          <div
            className={`text-right p-1 ${
              isToday ? "font-bold text-primary" : ""
            }`}
          >
            {formattedDate}
          </div>
          <div className="overflow-y-auto max-h-[80px]">
            {dayEvents.map((event) => (
              <div
                key={event.id}
                className="mb-1 p-1 text-xs rounded bg-primary text-white truncate"
                title={event.titulo}
              >
                {format(new Date(event.dataInicio), "HH:mm")} - {event.titulo}
              </div>
            ))}
          </div>
        </div>
      );

      day = addDays(day, 1);
    }

    rows.push(
      <div key={day.toString()} className="grid grid-cols-7">
        {days}
      </div>
    );
    days = [];
  }

  return (
    <div className="calendar-month">
      {/* Cabeçalho dos dias */}
      <div className="grid grid-cols-7 border-b">
        {dayNames.map((day) => (
          <div key={day} className="text-center py-2 border-r font-medium">
            {day}
          </div>
        ))}
      </div>

      {/* Grade do calendário */}
      {rows}
    </div>
  );
};

const WeekView = ({ date, events }: { date: Date; events: Evento[] }) => {
  const startDay = startOfWeek(date, { weekStartsOn: 1 });
  const endDay = endOfWeek(date, { weekStartsOn: 1 });

  // Horários do dia
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Dias da semana
  const days = [];
  let day = startDay;

  while (day <= endDay) {
    days.push(day);
    day = addDays(day, 1);
  }

  return (
    <div className="calendar-week overflow-x-auto">
      <div
        className="grid"
        style={{ gridTemplateColumns: "60px repeat(7, minmax(150px, 1fr))" }}
      >
        {/* Cabeçalho dos dias */}
        <div className="sticky top-0 z-10 bg-white"></div>
        {days.map((day, index) => {
          const isToday = isSameDay(day, new Date());
          const dayEvents = events.filter((event) =>
            isSameDay(new Date(event.dataInicio), day)
          );

          return (
            <div
              key={index}
              className={`sticky top-0 z-10 p-2 text-center font-medium border-b border-l ${
                isToday ? "bg-blue-50" : "bg-white"
              }`}
            >
              <div className="text-sm mb-1">
                {format(day, "EEE", { locale: ptBR })}
              </div>
              <div
                className={`text-lg ${isToday ? "text-primary font-bold" : ""}`}
              >
                {format(day, "d")}
              </div>
            </div>
          );
        })}

        {/* Linhas de hora */}
        {hours.map((hour) => (
          <React.Fragment key={hour}>
            <div className="p-1 text-xs text-right pr-2 border-r h-12 sticky left-0 bg-white">
              {hour}:00
            </div>
            {days.map((day, dayIndex) => {
              // Filtrar eventos para esta hora e dia
              const hourEvents = events.filter((event) => {
                const eventStart = new Date(event.dataInicio);
                return (
                  isSameDay(eventStart, day) && eventStart.getHours() === hour
                );
              });

              return (
                <div key={dayIndex} className="border h-12 border-l relative">
                  {hourEvents.map((event) => (
                    <div
                      key={event.id}
                      className="absolute inset-x-0 bg-primary text-white rounded p-1 text-xs overflow-hidden z-10 mx-1"
                      style={{
                        top: "2px",
                        height: "calc(100% - 4px)",
                      }}
                      title={event.titulo}
                    >
                      {format(new Date(event.dataInicio), "HH:mm")} -{" "}
                      {event.titulo}
                    </div>
                  ))}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const DayView = ({ date, events }: { date: Date; events: Evento[] }) => {
  // Horários do dia
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Eventos do dia
  const dayEvents = events.filter((event) =>
    isSameDay(new Date(event.dataInicio), date)
  );

  return (
    <div className="calendar-day">
      <div className="grid grid-cols-[60px_1fr] min-h-[800px]">
        {/* Linhas de hora */}
        {hours.map((hour) => (
          <React.Fragment key={hour}>
            <div className="p-1 text-xs text-right pr-2 border-r h-12 sticky left-0 bg-white">
              {hour}:00
            </div>
            <div className="border-b h-12 relative">
              {/* Eventos desta hora */}
              {dayEvents
                .filter(
                  (event) => new Date(event.dataInicio).getHours() === hour
                )
                .map((event) => {
                  const startTime = new Date(event.dataInicio);
                  const endTime = new Date(event.dataFim);
                  const durationHours =
                    (endTime.getTime() - startTime.getTime()) /
                    (1000 * 60 * 60);

                  return (
                    <div
                      key={event.id}
                      className="absolute inset-x-0 bg-primary text-white rounded p-2 overflow-hidden z-10 mx-1"
                      style={{
                        top: "2px",
                        height: `calc(${durationHours * 100}% - 4px)`,
                      }}
                    >
                      <div className="font-medium">{event.titulo}</div>
                      <div className="text-xs">
                        {format(startTime, "HH:mm")} -{" "}
                        {format(endTime, "HH:mm")}
                      </div>
                      <div className="text-xs mt-1">
                        {event.local || "Sem local definido"}
                      </div>
                    </div>
                  );
                })}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;
