import { KeyboardAvoidingView, Modal, Platform, Pressable, View } from "react-native"

interface Props {
    visible: boolean
    onClose: () => void
    children: React.ReactNode
}

export default function Drawer({ visible, onClose, children }: Props) {
    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <KeyboardAvoidingView
                className="flex-1 justify-end bg-black/40"
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <Pressable className="flex-1" onPress={onClose} />
                <View className="w-full rounded-t-2xl bg-white p-4 pb-30 border-2 border-b-0">
                    <View className="mb-4 items-center">
                        <View className="h-1.5 w-12 rounded-full bg-neutral-300" />
                    </View>
                    {children}
                </View>
            </KeyboardAvoidingView>
        </Modal>
    )
}
