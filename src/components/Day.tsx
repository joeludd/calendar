import { useMemo, useState } from "react"
import EventForm from "./EventForm"
import Events from "./Events"
import { useEvents } from "../context/useEvents"
// import { useEvents } from "../context/useEvents"

type DayProps = {
  day: Date
  nonMonth?: boolean
  showWeekday?: boolean
}

export default function Day({ day, nonMonth, showWeekday }: DayProps ) {
  const [eventFormOpen, setEventFormOpen] = useState(false)
  const { events } = useEvents()
  const dayEvents = useMemo(() => {
    const allDayEvents = events.filter(event => {
      return event.date.getTime() === day.getTime() && event.allDay
    })
    const timeEvents = events.filter(event => {
      return event.date.getTime() === day.getTime() && !event.allDay
    })
    return {allDayEvents, timeEvents}
  }, [events])

  function isToday() {
    const today = new Date()
    return day.getDate() == today.getDate() &&
      day.getMonth() == today.getMonth() &&
      day.getFullYear() == today.getFullYear()
  }

  function getDayName(dateStr: string, locale: string | undefined = undefined) {
    const date = new Date(dateStr)
    return date.toLocaleDateString(locale, { weekday: 'short' })
  }

  const dayName = getDayName(day.toDateString())

  const startToday = new Date(new Date().setHours(0,0,0,0))

  return (
    <>
    {/* Day */}
    <div className={`group relative bg-slate-50 flex flex-col ${day.getTime() < startToday.getTime() ? " [&_.events]:opacity-50 [&_.day-header]:opacity-50" : ""}${nonMonth ? " opacity-75" : ""}`}>
      {/* Day header */}
      <div className="day-header mb-1 pt-1 flex flex-col items-center relative">
        {/* Weekday name */}
        {showWeekday && <div className="uppercase text-xs/none font-normal text-slate-600 pb-px">{dayName}</div>}
        {/* Day number */}
        <div className={`text-sm/none size-6 pb-0.5 flex justify-center items-center ${isToday() ? 'bg-indigo-500 rounded-full text-white' : ''}`}>{day.getDate()}</div>
        {/* Add event btn */}
        <button className="opacity-0 absolute size-7 flex items-center justify-center -right-px -top-px text-xl border pl-px pb-0.5 rounded-bl border-slate-300 hover:bg-indigo-200 hover:border-indigo-500 hover:text-indigo-600 transition-colors duration-200 group-hover:opacity-100 focus:opacity-100 focus-visible:outline-none focus-visible:border-indigo-500 focus-visible:text-indigo-600 focus-visible:bg-indigo-200" onClick={() => setEventFormOpen(true)}>+</button>
      </div>
      {(dayEvents.allDayEvents.length !== 0 || dayEvents.timeEvents.length !== 0) && <Events data={dayEvents} day={day} />}
    </div>
    <EventForm day={day} isOpen={eventFormOpen} onClose={() => setEventFormOpen(false)} />
    </>
  )
}
