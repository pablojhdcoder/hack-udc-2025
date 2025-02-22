import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { themeColors } from "../theme";
import { ArrowLeftIcon } from "react-native-heroicons/solid";

const images = { icon: require("../assets/icon.png") };

export default function WelcomeScreen() {
    const navigation = useNavigation();
    return (
        <View style={{ flex: 1, backgroundColor: themeColors.bg }}>
            <SafeAreaView className="flex">
                <View className="flex-row justify-start">
                    <TouchableOpacity onpress={() => navigation.goBack()} className="bg-yellow-500 py-2 px-4 rounded-2xl">
                        <Text className="text-white font-bold text-center">Registrarse</Text> {/*Sign up*/}
                    </TouchableOpacity> 
                    <Image source={images.icon} style={{ width: 80, height: 80 }} />
                </View>    
                <View className="space-y-4 mt-6">   
                    <View className="flex justify-center">
                        <Text className="font-semibold text-white">¿Ya tienes una cuenta?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                            <Text className="text-blue-500 font-bold"> Iniciar sesión</Text> {/*Log in*/}
                        </TouchableOpacity>
                    </View>
                    <View className="flex justify-center">W

                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}