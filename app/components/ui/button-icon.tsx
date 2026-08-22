import { Pressable, PressableProps } from "react-native"
import { icons, IconKey } from "@/constants/icons"
import cn from "@/lib/cn"

type ButtonIconProps = PressableProps & {
    icon: IconKey
    size?: number
    className?: string
    iconColor?: string
}

function ButtonIcon({
    icon,
    size = 24,
    className,
    iconColor,
    ...pressableProps
}: ButtonIconProps) {
    const Icon = icons[icon]

    return (
        <Pressable
            className={cn(
                "rounded border-2 bg-white p-2 h-12 w-12 items-center justify-center",
                className,
            )}
            {...pressableProps}
        >
            <Icon width={size} height={size} color={iconColor} />
        </Pressable>
    )
}

export default ButtonIcon
