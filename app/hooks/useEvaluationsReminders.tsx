import { ensurePermissionsAsync, syncAllReminders, cancelOrphanReminders } from "@/lib/notifications"
import { useEvaluationsStore } from "@/stores/evaluationsStore"
import { Evaluation } from "@/types/evaluation"
import { useRef, useEffect } from "react"

export function useEvaluationsReminders() {
  const updateEvaluation = useEvaluationsStore((s) => s.updateEvaluation)
  const didInit = useRef(false)

  useEffect(() => {
    if (didInit.current) return
    didInit.current = true

    const runSync = async (evaluations: Evaluation[]) => {
      const granted = await ensurePermissionsAsync()
      if (!granted) return
      await syncAllReminders(evaluations, updateEvaluation)
    }

    runSync(useEvaluationsStore.getState().evaluations)

    const unsubscribe = useEvaluationsStore.subscribe((state, prevState) => {
      if (state.evaluations === prevState.evaluations) return
      cancelOrphanReminders(prevState.evaluations, state.evaluations)
      runSync(state.evaluations)
    })

    return unsubscribe
  }, [updateEvaluation])
}
