import { useEffect } from "react"
import { useSubjectsStore } from "@/stores/subjectsStore"

export const useChangeActualCareer = (careerId: string) => {
  const setActualCareer = useSubjectsStore((s) => s.setActualCareer)

  useEffect(() => {
    if(careerId) setActualCareer(careerId)
  }, [careerId, setActualCareer])
}
