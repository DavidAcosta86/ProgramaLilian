'use client';

import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react';
import { API_BASE_URL } from '@/lib/config';

// Custom CSS for calendar styling
const calendarStyles = `
  .react-calendar {
    width: 100%;
    border: none;
    font-family: inherit;
  }

  .react-calendar__navigation button {
    color: #1e40af;
    font-size: 16px;
    font-weight: 600;
  }

  .react-calendar__navigation button:hover {
    color: #3b82f6;
  }

  .react-calendar__month-view__weekdays {
    font-weight: 600;
    text-decoration: none;
    color: #374151;
  }

  .react-calendar__tile--active {
    background: #3b82f6 !important;
    color: white !important;
  }

  .react-calendar__tile--active:enabled:hover,
  .react-calendar__tile--active:enabled:focus {
    background: #2563eb !important;
  }

  .react-calendar__tile--hasEvent {
    background: #dbeafe !important;
    color: #1e40af !important;
    font-weight: 600;
  }

  .react-calendar__tile--hasEvent.react-calendar__tile--active {
    background: #3b82f6 !important;
    color: white !important;
  }

  .react-calendar__tile {
    height: 50px !important;
    font-size: 14px;
    border-radius: 6px;
    margin: 2px;
  }
`;

interface EventData {
  id: number;
  title?: string;
  content?: string;
  date?: string;
  section: string;
  imageData?: string;
  buttonText1?: string;
  buttonUrl1?: string;
  createdAt?: string;
}

interface CalendarEvents {
  [key: string]: EventData[];
}

interface EventCalendarProps {
  onDateSelect?: (date: Date, events: EventData[]) => void;
}

export default function EventCalendar({ onDateSelect }: EventCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvents>({});
  const [showModal, setShowModal] = useState(false);
  const [modalEvents, setModalEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Add custom styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = calendarStyles;
    document.head.appendChild(styleSheet);

    // Load calendar events
    loadCalendarEvents();

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const loadCalendarEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/content/upcoming`);
      if (response.ok) {
        const events: EventData[] = await response.json();

        // Group events by date
        const eventsByDate: CalendarEvents = {};

        events.forEach(event => {
          const eventDate = event.date || (event.createdAt ? format(new Date(event.createdAt), 'yyyy-MM-dd') : '');

          if (eventDate && !eventsByDate[eventDate]) {
            eventsByDate[eventDate] = [];
          }

          if (eventDate) {
            eventsByDate[eventDate].push(event);
          }
        });

        setCalendarEvents(eventsByDate);
      }
    } catch (error) {
      console.error('Error loading calendar events:', error);
    } finally {
      setLoading(false);
    }
  };

  const tileClassName = ({ date }: { date: Date }) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const hasEvents = calendarEvents[dateKey] && calendarEvents[dateKey].length > 0;
    const isSelected = isSameDay(date, selectedDate);

    if (hasEvents && !isSelected) {
      return 'react-calendar__tile--hasEvent';
    }

    return '';
  };

  const handleDateClick = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const dayEvents = calendarEvents[dateKey] || [];

    setSelectedDate(date);
    setModalEvents(dayEvents);
    setShowModal(true);

    if (onDateSelect && dayEvents.length > 0) {
      onDateSelect(date, dayEvents);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Calendario de Eventos
          </CardTitle>
          <CardDescription>
            Haz click en una fecha para ver los eventos del día
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="text-gray-500">Cargando calendario...</div>
            </div>
          ) : (
            <Calendar
              value={selectedDate}
              onClickDay={handleDateClick}
              tileClassName={tileClassName}
              locale="es"
              formatShortWeekday={(locale, value) => {
                return ['D', 'L', 'M', 'M', 'J', 'V', 'S'][value.getDay()];
              }}
            />
          )}

          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-100 rounded border border-blue-400"></div>
              <span>Días con eventos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded"></div>
              <span>Fecha seleccionada</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal para eventos del día */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">
                Eventos del {format(selectedDate, 'd \'de\' MMMM \'de\' yyyy', { locale: es })}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
            <div className="p-4 space-y-4">
              {modalEvents.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No hay eventos programados para este día.
                </p>
              ) : (
                modalEvents.map((event) => (
                  <Card key={event.id} className="border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{event.title || 'Evento'}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        {event.content && (
                          <p className="text-sm text-muted-foreground">{event.content}</p>
                        )}

                        {event.date && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CalendarIcon className="h-4 w-4" />
                            <span>{event.date}</span>
                          </div>
                        )}

                        {event.section === 'events' && event.buttonText1 && event.buttonUrl1 && (
                          <div className="pt-2">
                            <a
                              href={event.buttonUrl1.startsWith('http') ? event.buttonUrl1 : '#'}
                              className="text-sm bg-primary text-primary-foreground px-3 py-1 rounded hover:bg-primary/90 transition-colors"
                            >
                              {event.buttonText1}
                            </a>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
