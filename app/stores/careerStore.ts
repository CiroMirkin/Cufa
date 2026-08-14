import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Career } from "@/types/career"

interface CareerState {
  career: Career
}

export const useCareerStore = create<CareerState>()(
  persist(
    () => ({
      career: { id: "default", name: "" },
    }),
    {
      name: "career-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
