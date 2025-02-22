import { View, Text } from "react-native";
import React from "react" ;
import { SafeAreaView } from "react-native-safe-area-context";
import { themeColors } from "../theme";

export default function WelcomeScreen() {
    return (
        <SafeAreaView className="" style={{ flex: 1, backgroundColor: themeColors.primary }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>WelcomeScreen</Text>
            </View>
        </SafeAreaView>
    );
}