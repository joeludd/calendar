import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { cn } from "../utils/cs"

export type ModalProps = {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
}

export default function Modal({ children, isOpen, onClose }: ModalProps) {
  const [isClosing, setIsClosing] = useState(false)
  const prevIsOpen = useRef<boolean>()

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }

    document.addEventListener("keydown", handler)

    return () => {
      document.removeEventListener("keydown", handler)
    }
  }, [onClose])

  useLayoutEffect(() => {
    if (!isOpen && prevIsOpen.current) {
      setIsClosing(true)
    }

    prevIsOpen.current = isOpen
  }, [isOpen])
  
  if (!isOpen && !isClosing) return null

  return createPortal(
    <div onAnimationEnd={() => setIsClosing(false)} className={cn("fixed z-[999] inset-0 flex justify-center items-center [&.closing_.overlay]:animate-fade-out [&.closing_.modal-body]:animate-pop-out", isClosing && "closing")}>
      {/* Overlay */}
      <div className="overlay bg-transparent size-full fixed animate-fade-in" onClick={onClose}></div>
      {/* Modal body */}
      <div className="modal-body bg-slate-50 border border-slate-300 rounded-lg z-10 min-w-80 max-w-[95%] scale-0 animate-pop-in">
        {children}
      </div> 
    </div>, 
    document.querySelector("#modal-portal") as HTMLElement
  )
}
