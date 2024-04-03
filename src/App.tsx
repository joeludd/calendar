import { useState } from "react"
import Header from "./components/Header"
import Day from "./components/Day"
import { EventsProvider } from "./context/EventContext"

export type Month = {
  month: number
  year: number
}

function App() {
  const today: Date = new Date()
  const [currMonth, setCurrMonth] = useState<Month>({
    month: today.getMonth(), 
    year: today.getFullYear()
  })

  function getAllDaysInMonth(year: number, month: number) {
    return Array.from(
      { length: new Date(year, month, 0).getDate() },
      (_, i) => new Date(year, month - 1, i + 1)
    )
  }

  function getPrevMonthDays() {
    const firstDayCurrMonth = new Date(currMonth.year, currMonth.month, 1)
    if ( firstDayCurrMonth.getDay() === 1 ) return []
    
    const numberOfPrevDays = firstDayCurrMonth.getDay() - 1
    const lastDayPrevMonth = new Date(currMonth.year, currMonth.month, 0)

    const prevMonthDays = getAllDaysInMonth(lastDayPrevMonth.getFullYear(), lastDayPrevMonth.getMonth() + 1)

    return prevMonthDays.splice(
      lastDayPrevMonth.getDate() - numberOfPrevDays,
      numberOfPrevDays
    )
  }

  function getNextMonthDays() {
    const lastDayCurrMonth = new Date(currMonth.year, currMonth.month + 1, 0)
    if ( lastDayCurrMonth.getDay() === 0 ) return []
    
    const numberOfNextDays = 7 - lastDayCurrMonth.getDay()

    const nextMonthDays = getAllDaysInMonth(
      currMonth.month === 11 ? currMonth.year + 1 : currMonth.year, 
      currMonth.month === 11 ? 0 : currMonth.month + 2
    )

    return nextMonthDays.splice(
      0,
      numberOfNextDays
    )
  }

  function showWeekday(num: number) {
    const firstDayCurrMonth = new Date(currMonth.year, currMonth.month, 1)
    const numberOfDaysToShow = 8 - firstDayCurrMonth.getDay()
    return num < numberOfDaysToShow
  }

  let prevMonthDays: Date[] = getPrevMonthDays()

  let currMonthDays: Date[] = getAllDaysInMonth(currMonth.year, currMonth.month + 1)
  
  let nextMonthDays: Date[] = getNextMonthDays()

  // useEffect(() => {
  //   prevMonthDays = getPrevMonthDays()
  //   currMonthDays = getAllDaysInMonth(currMonth.year, currMonth.month)
  //   nextMonthDays = getNextMonthDays()
  // }, [currMonth])

  return (
    <EventsProvider>
      <div className="h-screen flex flex-col bg-slate-50">
        <Header currMonth={currMonth} setCurrMonth={setCurrMonth} />
        {/* Calendar days */}
        <div className="grow grid overflow-y-auto grid-cols-7 auto-rows-100px gap-px p-px bg-slate-300">
          {
            prevMonthDays.map(day => {
              return <Day key={day.toDateString()} day={day} nonMonth showWeekday />
            })
          }{
            currMonthDays.map((day, i) => {
              return <Day showWeekday={showWeekday(i)} key={day.toDateString()} day={day} />
            })
          }{
            nextMonthDays.map((day) => {
              return <Day key={day.toDateString()} day={day} nonMonth />
            })
          }
        </div>
      </div>
    </EventsProvider>
  )
}

export default App
