import cn from "@/lib/cn"
import { TextInput as RNTextInput, TextInputProps } from "react-native"

interface Props extends TextInputProps {
    className?: string
}

function TextInput({className, ...props}: Props) {
  return (
    <RNTextInput
      placeholderTextColor="#171717" // neutral-900
      className={cn("", className)}
      {...props}
    />
  )
}

export default TextInput
