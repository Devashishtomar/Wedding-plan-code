import React from 'react';
import { useEvent, ViewMode } from '@/contexts/EventContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Users, User, Settings2 } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from "@/lib/api";

const EventSelector: React.FC = () => {
  const {
    events,
    selectedEventId,
    setSelectedEventId,
    viewMode,
    setViewMode
  } = useEvent();
  const queryClient = useQueryClient();

  const { data: weddingRes } = useQuery<any>({
    queryKey: ['wedding-me'],
    queryFn: async () => {
      const res = await api.get("/api/weddings/me");
      return res.data;
    }
  });
  const memberContext = weddingRes?.data?.memberContext || weddingRes?.memberContext;
  const wedding = weddingRes?.data?.wedding || weddingRes?.wedding;

  const handleViewChange = (newMode: ViewMode) => {
    setViewMode(newMode);
  };

  const hasPrivateAccess = memberContext && (
    memberContext.role === 'BRIDE' ||
    memberContext.role === 'GROOM' ||
    (memberContext.side !== null && (memberContext.canViewPrivate || memberContext.canEditPrivate))
  );

  const canManageEvents = memberContext && (
    memberContext.role === 'BRIDE' ||
    memberContext.role === 'GROOM' ||
    memberContext.canManageEvents === true
  );

  return (
    <div className="flex items-center gap-3 bg-muted/40 p-1 rounded-xl border border-border/50 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center bg-background/50 rounded-lg p-0.5 border border-border/40">
        {hasPrivateAccess && (
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 gap-2 px-3 rounded-md transition-all duration-300",
              viewMode === 'individual'
                ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                : "text-muted-foreground hover:bg-muted"
            )}
            onClick={() => handleViewChange('individual')}
            title="Individual Event View"
          >
            <User className="h-3.5 w-3.5" />
            <span className="hidden lg:inline text-[10px] font-bold uppercase tracking-wider">Individual View</span>
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 gap-2 px-3 rounded-md transition-all duration-300",
            viewMode === 'collaborative' || !hasPrivateAccess
              ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
              : "text-muted-foreground hover:bg-muted"
          )}
          onClick={() => handleViewChange('collaborative')}
          title="Collaborative Wedding View"
        >
          <Users className="h-3.5 w-3.5" />
          <span className="hidden lg:inline text-[10px] font-bold uppercase tracking-wider">Collaborative View</span>
        </Button>
      </div>

      <div className="h-6 w-[1px] bg-border/60 mx-1" />

      <div className="flex items-center gap-2 transition-all duration-500">
        <Select
          value={selectedEventId || "all"}
          onValueChange={setSelectedEventId}
        >
          {/* FIXED: Using w-full, justify-between, and min-w-0 to cleanly push the date to the edge while truncating long names */}
          <SelectTrigger className="w-[180px] md:w-[240px] h-8 bg-background border-none shadow-none focus:ring-1 focus:ring-primary/30 font-medium text-sm [&>span]:w-full [&>span]:flex [&>span]:items-center [&>span]:justify-between [&>span]:gap-3 [&>span]:min-w-0">
            <SelectValue placeholder="Focus on Event" />
          </SelectTrigger>
          <SelectContent className="border-none shadow-xl rounded-xl w-[220px] md:w-[260px]">
            <SelectItem value="all" className="rounded-lg focus:bg-primary/10 focus:text-primary transition-colors w-full">
              <div className="flex items-center justify-between w-full gap-3 min-w-0">
                <span className="font-semibold text-sm truncate flex-1 text-left">All Events</span>
                {wedding?.date && (
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0 opacity-80">
                    {new Date(wedding.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                )}
              </div>
            </SelectItem>

            {events.map((event) => (
              <SelectItem
                key={event.id}
                value={event.id}
                className="rounded-lg focus:bg-primary/10 focus:text-primary transition-colors w-full"
              >
                <div className="flex items-center justify-between w-full gap-3 min-w-0">
                  <span className="font-semibold text-sm truncate flex-1 text-left">{event.name}</span>
                  {event.date && (
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0 opacity-80">
                      {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {canManageEvents && (
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="h-8 gap-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors px-2"
            title="Manage All Events"
          >
            <Link to="/account">
              <Settings2 className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider hidden xl:inline">Manage Events</span>
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default EventSelector;