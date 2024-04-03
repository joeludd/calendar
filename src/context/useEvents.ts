import { useContext } from "react"
import { EventsContext } from "./EventContext"

// export const EVENT_COLORS = ["red", "blue", "green"] as const

export function useEvents() {
  const eventsContext = useContext(EventsContext)
  if ( eventsContext == null ) {
    throw new Error('eventsContext must be used within provider')
  }

  return eventsContext
}