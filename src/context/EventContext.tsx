import { createContext, useEffect, useState } from "react"
import { EVENT_COLORS } from "../utils/eventColors"
import { UnionOmit } from "../utils/types"

export type CalEvent = {
  id: string
  date: Date
  name: string
  color: typeof EVENT_COLORS[number]
} & ({ 
  allDay: false
  startTime: string
  endTime: string 
} | {
  allDay: true
  startTime?: never
  endTime?: never
})

type EventsContextType = {
  events: CalEvent[]
  addEvent: (event: UnionOmit<CalEvent, "id">) => void
  updateEvent: (event: CalEvent) => void
  deleteEvent: (event: CalEvent) => void
}

export const EventsContext = createContext<EventsContextType | null>(null)

// Provider

function useLocalStorageEvents(key: string, initialValue: CalEvent[]) {
  const [value, setValue] = useState<CalEvent[]>(() => {
    const jsonValue = localStorage.getItem(key)
    if (jsonValue == null) return initialValue

    return (JSON.parse(jsonValue) as CalEvent[]).map(event => {
      if (event.date instanceof Date) return event
      return {...event, date: new Date(event.date)}
    })
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [value, key])

  return [value, setValue] as const
}

type EventsProviderProps = {
  children: React.ReactNode
}

export function EventsProvider({ children }: EventsProviderProps) {
  const [events, setEvents] = useLocalStorageEvents("EVENTS", [])

  function addEvent(event: UnionOmit<CalEvent, "id">) {
    setEvents(prevEvents => {
      return [...prevEvents, {...event, id: crypto.randomUUID()}]
    })
  }

  function updateEvent(event: CalEvent) {
    setEvents(prevEvents => {
      return [event, ...prevEvents.filter(e => e.id !== event.id)]
    })
  }

  function deleteEvent(event: CalEvent) {
    setEvents(prevEvents => {
      return prevEvents.filter(e => e.id !== event.id)
    })
  }

  return (
    <EventsContext.Provider value={{events, addEvent, updateEvent, deleteEvent}}>
      {children}
    </EventsContext.Provider>
  )
}