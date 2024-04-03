import { useLayoutEffect, useMemo, useRef, useState } from "react"
import EventForm from "./EventForm"
import type { CalEvent } from "../context/EventContext"
import { cn } from "../utils/cs"
import ShowEventsModal from "./ShowEventsModal"

type EventsProps = {
  data: { allDayEvents: CalEvent[]; timeEvents: CalEvent[]; }
  day: Date
}

export default function Events({ data, day }: EventsProps) {
  const [eventFormOpen, setEventFormOpen] = useState(false)
  const [currEvent, setCurrEvent] = useState<CalEvent>()
  const [showAllEventsBtn, setShowAllEventsBtn] = useState(false)
  const [allEventsOpen, setAllEventsOpen] = useState(false)

  function handleEditEvent(event: CalEvent) {
    setCurrEvent(event)
    setEventFormOpen(true)
  }

  function startTimeToNumber(time: string | undefined) {
    if (typeof time !== "string") return 0
    return parseInt(time.replace(":", ""))
  }
  const sortedTimeEvents = useMemo(() => {
    const sorted = [...data.timeEvents].sort((a, b) => startTimeToNumber(a.startTime) - startTimeToNumber(b.startTime))

    return sorted
  }, [data.timeEvents])

  // Show all events
  const wrapperRef = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    if (!wrapperRef.current) return
    let wrapperH = wrapperRef.current.clientHeight
    let eventsH = wrapperRef.current.scrollHeight
    // const allDayEvents = wrapperRef.current?.querySelectorAll(".all-day-event")
    // const timeEvents = wrapperRef.current?.querySelectorAll(".time-event")
    // const allDayEventH = allDayEvents?.length ? allDayEvents[0].clientHeight : 0
    // const timeEventH = timeEvents?.length ? timeEvents[0].clientHeight : 0
    // const allDayEventsH = allDayEvents?.length ? allDayEvents.length * allDayEventH : 0
    // const timeEventsH = timeEvents?.length ? timeEvents.length * timeEventH : 0
    // const eventsAmount = (allDayEvents?.length ? allDayEvents.length : 0) + (timeEvents?.length ? timeEvents.length : 0)
    // const eventsH = allDayEventsH + timeEventsH + (eventsAmount > 1 ? 4 * (eventsAmount - 1) : 0)

    if (eventsH > wrapperH) {
      setShowAllEventsBtn(true)
    } else {
      setShowAllEventsBtn(false)
    }

    const resizeObs = new ResizeObserver(() => {
      if (!wrapperRef.current) return
      
      wrapperH = wrapperRef.current.clientHeight
      eventsH = wrapperRef.current.scrollHeight

      if (eventsH > wrapperH) {
        setShowAllEventsBtn(true)
      } else {
        setShowAllEventsBtn(false)
      }
    })

    resizeObs.observe(wrapperRef.current)

    return () => resizeObs.disconnect()
  }, [data])

  return (
    <>
    <div ref={wrapperRef} className="events px-1 flex flex-col gap-1 flex-grow overflow-hidden text-base/5">
      {
        data.allDayEvents.map(event => {
          console.log
          return (
            <button key={event.id} className={cn("all-day-event pb-1 px-2 rounded border flex text-center flex-shrink-0 w-full hover:ring-1 focus-visible:ring-1 outline-none ring-inset transition-all duration-200", `text-${event.color}-600 bg-${event.color}-200 border-${event.color}-500 ring-${event.color}-500`)} onClick={() => handleEditEvent(event)}>
              <div className="truncate">{event.name}</div>
            </button>
          )
        })
      }
      {
        sortedTimeEvents.map(event => {
          return (
            <button key={event.id} className={cn("group/event time-event flex text-center flex-shrink-0 w-full px-1 rounded [&>*:not(:last-child)]:mr-2 hover:ring-1 focus-visible:ring-1 outline-none ring-inset transition-all duration-200", `ring-${event.color}-500`)} onClick={() => handleEditEvent(event)}>
              <div className={cn('rounded-full size-2 flex-shrink-0 self-center', `bg-${event.color}-500`)}></div>
              <div className="text-slate-600 pb-0.5 group-hover/event:text-slate-800">{event.startTime}</div>
              <div className="truncate text-slate-800 pb-0.5 group-hover/event:text-slate-950">{event.name}</div>
            </button>
          )
        })
      }
    </div>
    {showAllEventsBtn && (
      <button className="absolute w-[calc(100%+2px)] -left-px -bottom-px bg-slate-200 text-xs/4 text-slate-600 pt-[1px] pb-[2px] border border-slate-300 hover:bg-indigo-200 hover:text-indigo-600 hover:border-indigo-500 transition-colors duration-200" onClick={() => setAllEventsOpen(true)}>View all</button>
    )}
    <ShowEventsModal allDayEvents={data.allDayEvents} timeEvents={sortedTimeEvents} day={day} isOpen={allEventsOpen} onClose={() => setAllEventsOpen(false)} />
    <EventForm event={currEvent} day={day} isOpen={eventFormOpen} onClose={() => setEventFormOpen(false)} />
    </>
  )
}