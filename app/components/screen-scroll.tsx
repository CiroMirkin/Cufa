import { Platform, ScrollView, ScrollViewProps } from "react-native"

export default function ScreenScroll({ className, contentContainerClassName, children, ...props }: ScrollViewProps) {
  return (
    <ScrollView
      {...props}
      className={`flex-1 bg-white ${className ?? ""}`}
      contentContainerClassName={`pb-8 ${contentContainerClassName ?? ""}`}
      persistentScrollbar={Platform.OS === "android"}
      indicatorStyle={Platform.OS === "ios" ? "black" : undefined}
      showsVerticalScrollIndicator
    >
      {children}
    </ScrollView>
  )
}