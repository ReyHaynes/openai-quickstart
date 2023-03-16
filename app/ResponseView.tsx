import lang from "@lib/lang"
import { typeText } from "@lib/typeText"
import { useEffect, useRef } from "react"

interface ResponseViewProps {
  isLoading: boolean
  promptResponse: string
}

export default function ResponseView({
  promptResponse,
  isLoading,
}: ResponseViewProps) {
  const responseContainerRef = useRef<HTMLDivElement>(null)
  const responseRef = useRef<HTMLSpanElement>(null)
  let typing = useRef<() => void>()

  useEffect(() => {
    if (!responseContainerRef.current || !responseRef.current) return

    typeText(lang.promptDefault, responseRef.current, true)

    const responseArea = new ResizeObserver(scrollResponseDiv)
    responseArea.observe(responseRef.current)

    return () => {
      responseArea.disconnect()
      typing.current?.()
    }
  }, [])

  useEffect(() => {
    if (!responseRef.current) return
    if (isLoading) {
      setPromptResponse()
      typing.current = typeText(lang.loading, responseRef.current)
      return
    }
    if (
      promptResponse === "" &&
      responseRef.current.innerHTML === lang.promptDefault
    ) {
      return
    }

    setPromptResponse()

    typing.current = typeText(promptResponse, responseRef.current)
  }, [promptResponse, isLoading])

  const setPromptResponse = (text: string = "") => {
    if (!responseRef.current) return

    if (typing.current) typing.current()
    typeText(text, responseRef.current, true)
  }

  const scrollResponseDiv = ([{ target: element }]: ResizeObserverEntry[]) => {
    if (!responseContainerRef.current) return

    responseContainerRef.current.scrollTop = element.scrollHeight
  }

  return (
    <div
      className="flex w-full flex-grow items-center overflow-y-auto whitespace-pre-wrap p-6"
      ref={responseContainerRef}
    >
      <span
        className="inline-block after:mx-1 after:-mb-0.5 after:inline-block after:h-4 after:w-1.5 after:animate-blink after:bg-white"
        ref={responseRef}
      />
    </div>
  )
}
