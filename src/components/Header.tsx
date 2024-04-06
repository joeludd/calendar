import type { Month } from "../App"
import { Dispatch, SetStateAction } from "react"

type HeaderProps = {
  currMonth: {
    month: number
    year: number
  }
  setCurrMonth: Dispatch<SetStateAction<Month>>
}

export default function Header({ currMonth, setCurrMonth }: HeaderProps) {
  const date = new Date(currMonth.year, currMonth.month, 1)
  const monthName = date.toLocaleString('en-US', {month: 'long'})

  function handleChangeMonth(val: "prev" | "next") {
    if (val === "prev") {
      setCurrMonth(prev => {
        let prevMonth = prev.month - 1
        let prevYear = prev.year
        if (prev.month === 0) {
          prevMonth = 11
          prevYear = prev.year - 1
        }
        return {
          month: prevMonth,
          year: prevYear
        }
      })
    }
    if (val === "next") {
      setCurrMonth(prev => {
        let nextMonth = prev.month + 1
        let nextYear = prev.year
        if (prev.month === 11) {
          nextMonth = 0
          nextYear = prev.year + 1
        }
        return {
          month: nextMonth,
          year: nextYear
        }
      })
    }
  }

  function setToday() {
    const today = new Date()
    setCurrMonth({
      month: today.getMonth(),
      year: today.getFullYear()
    })
  }
  
  return (
    <div className="p-4 w-full flex items-center space-x-2 text-slate-600">
      <button className="btn hover:bg-indigo-200 hover:border-indigo-500 hover:text-indigo-600 focus-visible:bg-indigo-200 focus-visible:ring-0 focus-visible:text-indigo-600 focus-visible:border-indigo-500" onClick={() => setToday()}>Today</button>
      <div className="text-lg space-x-px bg-slate-300 rounded overflow-hidden hover:bg-indigo-500 transition-colors duration-200 focus-visible:bg-indigo-500">
        <button className="size-[34px] pb-px text-center bg-slate-50 transition-colors duration-200 hover:bg-indigo-200 hover:text-indigo-600 border border-r-0 border-slate-300 rounded-l hover:border-indigo-500 focus-visible:bg-indigo-200 focus-visible:border-indigo-500 focus-visible:text-indigo-600 focus-visible:outline-none" onClick={() => handleChangeMonth("prev")}>&lt;</button>
        <button className="size-[34px] pb-px text-center bg-slate-50 transition-colors duration-200 hover:bg-indigo-200 hover:text-indigo-600 border border-l-0 border-slate-300 rounded-r hover:border-indigo-500 focus-visible:bg-indigo-200 focus-visible:border-indigo-500 focus-visible:text-indigo-600 focus-visible:outline-none" onClick={() => handleChangeMonth("next")}>&gt;</button>
      </div>
      <span className="text-2xl font-extrabold !ml-4 pt-px uppercase tracking-tighter">{`${monthName} ${currMonth.year}`}</span>
    </div>
  )
}
