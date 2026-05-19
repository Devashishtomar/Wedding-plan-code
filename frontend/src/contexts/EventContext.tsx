import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '@/lib/api';

export type ViewMode = 'individual' | 'collaborative';

export interface Event {
  id: string;
  name: string;
  date: string | null;
  location: string | null;
  isCustom: boolean;
  type: string;
  budget: number;
  visibility: string;
}

interface EventContextType {
  events: Event[];
  selectedEventId: string | null;
  selectedEvent: Event | null;
  viewMode: ViewMode;
  loading: boolean;
  setSelectedEventId: (id: string | null) => void;
  setViewMode: (mode: ViewMode) => void;
  refreshEvents: () => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('collaborative');
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const res = await api.get(`/api/events?view=${viewMode === 'collaborative' ? 'SHARED' : 'PRIVATE'}`);
      setEvents(res.data.events);

      // FIXED: Strict Event Pillar mapping. If event doesn't exist in this view, fallback strictly to 'all'
      if (selectedEventId !== 'all' && !res.data.events.find((e: Event) => e.id === selectedEventId)) {
        setSelectedEventId('all');
      }
    } catch (err) {
      console.error('Failed to fetch events', err);
    } finally {
      setLoading(false);
    }
  };

  const { pathname } = useLocation();

  useEffect(() => {
    const publicPaths = ['/login', '/register', '/', '/rsvp', '/wedding-setup'];
    const isPublic = publicPaths.some(path =>
      pathname === path || pathname.startsWith(path + '/')
    );

    if (!isPublic) {
      fetchEvents();
    }
  }, [viewMode, pathname]);

  useEffect(() => {
    const publicPaths = ['/login', '/register', '/', '/rsvp', '/wedding-setup'];
    const isPublic = publicPaths.some(path =>
      pathname === path || pathname.startsWith(path + '/')
    );

    if (!isPublic && events.length === 0) {
      fetchEvents();
    } else if (isPublic) {
      setLoading(false);
    }
  }, [pathname, events.length]);

  const selectedEvent = events.find(e => e.id === selectedEventId) || null;

  return (
    <EventContext.Provider
      value={{
        events,
        selectedEventId,
        selectedEvent,
        viewMode,
        loading,
        setSelectedEventId,
        setViewMode,
        refreshEvents: fetchEvents,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
};
