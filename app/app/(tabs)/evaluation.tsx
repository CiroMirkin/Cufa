import EvaluationList from "@/components/evaluation/evaluation-list"
import ScreenScroll from "@/components/screen-scroll"
import { useEvaluationsStore } from "@/stores/evaluationsStore"
import { useShallow } from 'zustand/react/shallow'
import { Text, View } from "react-native"
import { Link } from "expo-router"
import { icons } from "@/constants/icons"
import EmptySpace from "@/components/ui/empty-space"
import { evaluationToDate } from "@/lib/date"

export default function EvaluationsTab() {
  const evaluations = useEvaluationsStore(
    useShallow((s) => {
      const startOfToday = new Date()
      startOfToday.setHours(0, 0, 0, 0)

      return s.evaluations
        .filter((e) => evaluationToDate(e).getTime() >= startOfToday.getTime())
        .sort((a, b) => evaluationToDate(a).getTime() - evaluationToDate(b).getTime())
    }),
  )

  return (
    <ScreenScroll>
      <View className="flex-row items-center justify-between px-4 pt-4">
        <Text className="text-xl font-bold text-black">Evaluaciones</Text>
        <Link
          href={{ pathname: "/(tabs)/(evaluation)/new", params: { subjectId: null } }}
          className="rounded border-2 bg-green p-2"
        >
          <icons.plus width={24} height={24} />
        </Link>
      </View>

      <View className="px-4">
        {!evaluations || evaluations.length === 0 && <EmptySpace icon="calendar_event" message="Por el momento no hay evaluaciones" />}
        <EvaluationList
          evaluations={evaluations}
        />
      </View>
    </ScreenScroll>
  )
}
