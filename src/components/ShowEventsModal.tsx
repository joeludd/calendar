import Modal, { ModalProps } from "./Modal"
import type { CalEvent } from "../context/EventContext"
import { cn } from "../utils/cs"
import EventForm from "./EventForm"
import { useEffect, useRef, useState } from "react"

type ShowEventsModalProps = {
  day: Date
  allDayEvents: CalEvent[]
  timeEvents: CalEvent[]
} & Omit<ModalProps, "children">

export default function ShowEventsModal({ day, allDayEvents, timeEvents, ...modalProps }: ShowEventsModalProps) {
  const [eventFormOpen, setEventFormOpen] = useState(false)
  const [currEvent, setCurrEvent] = useState<CalEvent>()

  function handleEditEvent(event: CalEvent) {
    setCurrEvent(event)
    setEventFormOpen(true)
  }

  //Focus modal on open
  const eventsRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (modalProps.isOpen) {
      setTimeout(() => {
        if (!eventsRef.current) return
        const firstEvent = eventsRef.current.querySelector('button')
        firstEvent?.focus()
      }, 0)
    }
  }, [modalProps.isOpen])

  return (
  <>
    <Modal {...modalProps}>
      {/* Modal title */}
      <div className="relative text-xl/10 pl-4 pr-14 py-px border-b border-slate-300 flex justify-between items-center [&>*:not:last-child]:mr-1">
        <div className="uppercase font-extrabold tracking-tighter text-slate-600">All events</div>
        <small className="text-slate-500">{`${day.getDate()}/${day.getMonth() + 1}/${day.getFullYear().toString().substring(2)}`}</small>
        <button className="close-btn absolute -top-px -right-px text-2xl size-11 text-center align-middle border border-slate-300 rounded-tr-lg transition-colors duration-200 hover:bg-indigo-200 hover:border-indigo-500 hover:text-indigo-600 outline-none focus-visible:bg-indigo-200 focus-visible:border-indigo-500 focus-visible:text-indigo-600" onClick={modalProps.onClose}>&times;</button>
      </div>
      <div ref={eventsRef} className="events p-4 relative flex flex-col gap-1 flex-grow overflow-hidden text-base/5">
      {
        allDayEvents.map(event => {
          console.log
          return (
            <button key={event.id} className={cn("all-day-event tracking-tight py-0.5 px-2 rounded border flex flex-shrink-0 w-full hover:ring-1 focus:ring-1 outline-none ring-inset transition-all duration-200", `text-${event.color}-600 bg-${event.color}-200 border-${event.color}-500 ring-${event.color}-500`)} onClick={() => handleEditEvent(event)}>
              <div className="truncate">{event.name}</div>
            </button>
          )
        })
      }
      {
        timeEvents.map(event => {
          return (
            <button key={event.id} className={cn("group/event time-event tracking-tight flex flex-shrink-0 w-full px-1 py-px rounded [&>*:not(:last-child)]:mr-2 hover:ring-1 focus:ring-1 outline-none ring-inset transition-all duration-200", `ring-${event.color}-500`)} onClick={() => handleEditEvent(event)}>
              <div className={cn('rounded-full size-2 flex-shrink-0 self-center', `bg-${event.color}-500`)}></div>
              <div className="text-slate-600 py-px group-hover/event:text-slate-800">{event.startTime}</div>
              <div className="truncate text-slate-800 py-px group-hover/event:text-slate-950">{event.name}</div>
            </button>
          )
        })
      }
      </div>
    </Modal>
    <EventForm event={currEvent} day={day} isOpen={eventFormOpen} onClose={() => setEventFormOpen(false)} />
  </>
  )
}
