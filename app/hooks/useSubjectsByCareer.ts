import { useShallow } from "zustand/react/shallow"
import { useSubjectsStore } from "@/stores/subjectsStore"

export const useSubjectsByCareer = () =>
  useSubjectsStore(
    useShallow((s) => 
        s.subjects.filter((sub) => sub.careerId === s.actualCareer
    )),
  )
  