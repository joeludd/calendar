import { useEffect, useId, useState } from "react"
import { useEvents } from "../context/useEvents"
import Modal, { ModalProps } from "./Modal"
import { EVENT_COLORS } from "../utils/eventColors"
import type { CalEvent } from "../context/EventContext"
import { UnionOmit } from "../utils/types"
import { cn } from "../utils/cs"
import { Switch } from '@headlessui/react'

type EventFormProps = {
  day: Date
  event?: CalEvent
} & Omit<ModalProps, "children">

export default function EventForm({ day, event, ...modalProps }: EventFormProps) {
  const formId = useId()
  const { addEvent, updateEvent, deleteEvent } = useEvents()

  // Form fields with state
  const [formAllDay, setFormAllDay] = useState(false)
  const [formColor, setFormColor] = useState(event?.color || EVENT_COLORS[0])

  // Populate fields on edit
  useEffect(() => {
    if (modalProps.isOpen) {
      const formNameInput = document.querySelector<HTMLInputElement>(`#${CSS.escape(formId)}-name`)!
      if ( event ) {
        formNameInput.setRangeText(event.name, 0, 0)
        setFormAllDay(event.allDay)
        if ( !event.allDay ) {
          setTimeout(() => {
            const formStartTime = document.querySelector<HTMLInputElement>(`#${CSS.escape(formId)}-start-time`)!
            const formEndTime = document.querySelector<HTMLInputElement>(`#${CSS.escape(formId)}-end-time`)!
            formStartTime.value = event.startTime
            formEndTime.value = event.endTime
          }, 0)
        }
        setFormColor(event.color)
      }
      // Focus name input on open
      setTimeout(() => {
        formNameInput.focus()
      }, 0)
    }
  }, [modalProps.isOpen])

  function formatNewEndTime(time: number) {
    let newTime = (time + 1).toString()
    if (newTime.length < 4) {
      newTime = newTime.padStart(4, "0")
    }
    if (newTime.slice(2, 4) === "60") {
      const newHour = parseInt(newTime.slice(0, 2)) + 1
      if (newHour === 24) {
        newTime = "2359"
      } else {
        newTime = newTime.replace(newTime, newHour.toString() + "00")
      }
    }

    newTime = newTime.substring(0, 2) + ":" + newTime.substring(2);

    return newTime
  }

  function formatNewStartTime(time: number) {
    let newTime = (time - 1).toString()
    if (newTime.length < 4) {
      newTime = newTime.padStart(4, "0")
    }
    if (newTime.slice(2, 4) === "99") {
      newTime = newTime.replace(newTime.substring(2, 4), "59")
    }
    if (newTime.slice(2, 4) === "-1") {
      newTime = "0000"
    }

    newTime = newTime.substring(0, 2) + ":" + newTime.substring(2);

    return newTime
  }

  function handleTimeChange(input: "start" | "end") {
    const formStartTime = document.querySelector<HTMLInputElement>(`#${CSS.escape(formId)}-start-time`)!
    const formEndTime = document.querySelector<HTMLInputElement>(`#${CSS.escape(formId)}-end-time`)!

    const startTime = parseInt(formStartTime.value.replace(":", ""))
    const endTime = parseInt(formEndTime.value.replace(":", ""))

    if (input === "start") {
      if (startTime >= endTime) {
        formEndTime.value = formatNewEndTime(startTime)
      }
    }
    if (input === "end") {
      if (startTime >= endTime) {
        formStartTime.value = formatNewStartTime(endTime)
      }
    }
  }

  function handleNewEvent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const formNameInput = document.querySelector<HTMLInputElement>(`#${CSS.escape(formId)}-name`)!

    let newEvent: UnionOmit<CalEvent, "id">
    if ( formAllDay ) {
      newEvent = {
        date: day,
        name: formNameInput.value,
        allDay: formAllDay,
        color: formColor
      }
    } else {
      const formStartTime = document.querySelector<HTMLInputElement>(`#${CSS.escape(formId)}-start-time`)!
      const formEndTime = document.querySelector<HTMLInputElement>(`#${CSS.escape(formId)}-end-time`)!
      newEvent = {
        date: day,
        name: formNameInput.value,
        allDay: formAllDay,
        startTime: formStartTime.value,
        endTime: formEndTime.value,
        color: formColor
      }
    }

    addEvent(newEvent)
    modalProps.onClose()
  }

  function handleUpdateEvent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if ( !event ) return

    const formNameInput = document.querySelector<HTMLInputElement>(`#${CSS.escape(formId)}-name`)!

    let updatedEvent: CalEvent
    if ( formAllDay ) {
      updatedEvent = {
        id: event.id,
        date: event.date,
        name: formNameInput.value,
        allDay: formAllDay,
        color: formColor
      }
    } else {
      const formStartTime = document.querySelector<HTMLInputElement>(`#${CSS.escape(formId)}-start-time`)!
      const formEndTime = document.querySelector<HTMLInputElement>(`#${CSS.escape(formId)}-end-time`)!
      updatedEvent = {
        id: event.id,
        date: event.date,
        name: formNameInput.value,
        allDay: formAllDay,
        startTime: formStartTime.value,
        endTime: formEndTime.value,
        color: formColor
      }
    }

    updateEvent(updatedEvent)
    modalProps.onClose()
  }

  function onDelete() {
    if (!event) return

    deleteEvent(event)
    modalProps.onClose()
  }

  return (
    <Modal {...modalProps}>
      {/* Modal title */}
      <div className="relative text-xl/10 pl-4 pr-14 py-px border-b border-slate-300 flex justify-between items-center [&>*:not:last-child]:mr-1">
        <div className="uppercase font-extrabold tracking-tighter text-slate-600">{event ? "Edit" : "Add"} event</div>
        <small className="text-slate-500">{`${day.getDate()}/${day.getMonth() + 1}/${day.getFullYear().toString().substring(2)}`}</small>
        <button className="close-btn absolute -top-px -right-px text-2xl size-11 text-center align-middle border border-slate-300 rounded-tr-lg transition-colors duration-200 hover:bg-indigo-200 hover:border-indigo-500 hover:text-indigo-600 outline-none focus-visible:bg-indigo-200 focus-visible:border-indigo-500 focus-visible:text-indigo-600" onClick={modalProps.onClose}>&times;</button>
      </div>
      <div className="p-4">
        <form onSubmit={event ? e => handleUpdateEvent(e) : e => handleNewEvent(e)}>
          {/* Name */}
          <FormGroup>
            <label htmlFor={`${formId}-name`}>Name</label>
            <input type="text" name="name" id={`${formId}-name`} required />
          </FormGroup>
          {/* All day event */}
          <FormGroup className="flex-row items-center">
            <Switch.Group>
              <div className="flex items-center">
                <Switch.Label className="mr-2">All day?</Switch.Label>
                <Switch
                  checked={formAllDay}
                  onChange={setFormAllDay}
                  className={`${
                    formAllDay ? 'bg-indigo-200 border-indigo-500' : 'bg-slate-50 border-slate-300'
                  } border relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      formAllDay ? 'translate-x-6 bg-indigo-600' : 'translate-x-1 bg-slate-600'
                    } inline-block h-4 w-4 transform rounded-full  transition-transform`}
                  />
                </Switch>
              </div>
            </Switch.Group>
            {/* <input type="checkbox" name="all-day" id={`${formId}-all-day`} className="cursor-pointer"
              checked={formAllDay}
              onChange={() => setFormAllDay(prevValue => !prevValue)}
            />
            <label className="pl-2 cursor-pointer" htmlFor={`${formId}-all-day`}>All Day?</label> */}
          </FormGroup>
          {/* Event start/end time */}
          <div className={cn("flex [&>*]:flex-grow [&>*]:basis-0 space-x-2", formAllDay ? 'opacity-50' : 'opacity-100')}>
            <FormGroup>
              <label htmlFor={`${formId}-start-time`}>Start Time</label>
              <input type="time" name="start-time" id={`${formId}-start-time`} required={!formAllDay} disabled={formAllDay} onBlur={() => handleTimeChange("start")} />
            </FormGroup>
            <FormGroup>
              <label htmlFor={`${formId}-end-time`}>End Time</label>
              <input type="time" name="end-time" id={`${formId}-end-time`} required={!formAllDay} disabled={formAllDay} onBlur={() => handleTimeChange("end")} />
            </FormGroup>
          </div>
          {/* Color */}
          <FormGroup>
            <label>Color</label>
            <div className="flex [&>*]:flex-grow-0 space-x-2">
              {
                EVENT_COLORS.map(color => {
                  return <div key={color}>
                  <input
                    type="radio"
                    name="color"
                    value={color}
                    id={formId + "-" + color}
                    className="peer absolute opacity-0 -left-[9999]"
                    checked={formColor === color}
                    onChange={() => setFormColor(color)}
                  />
                  <label className={`color-label block size-7 rounded opacity-25 cursor-pointer bg-${color}-500 peer-checked:opacity-100 peer-focus-visible:ring-1 ring-offset-1 ring-${color}-500`} htmlFor={formId + "-" + color}><span className="sr-only">{color}</span></label>
                  </div>
                })
              }
            </div>
          </FormGroup>
          {/* Buttons */}
          <div className="flex [&>*]:flex-grow [&>*]:basis-0 space-x-2">
            <button className="btn btn-success" type="submit">{event ? "Save" : "Add"}</button>
            {event && <button className="btn btn-delete" type="button" onClick={onDelete}>Delete</button>}
          </div>
        </form>
      </div>
    </Modal>
  )
}

type FormGroupProps = React.HTMLAttributes<HTMLDivElement>

function FormGroup( { children, className, ...props }: FormGroupProps ) {
  return (
    <div {...props} 
      className={cn("flex flex-col [&:not(:last-child)]:mb-4 [&_label]:text-bold [&_label]:text-sm [&_label]:text-slate-500 [&_label]:tracking-tight [&_label:not(.color-label)]:my-0.5 [&_input]:px-2 [&_input]:pt-1 [&_input]:pb-[5px] [&_input]:bg-slate-50 [&_input]:border [&_input]:border-slate-300 [&_input]:rounded [&_input:focus-visible]:border-indigo-500 [&_input:focus-visible]:outline-none", className)}>
      {children}
    </div>
  )
}