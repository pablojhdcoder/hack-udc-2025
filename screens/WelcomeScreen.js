import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { themeColors } from "../theme";
import { useNavigation } from "@react-navigation/native"; 


const images = { icon: require("../assets/icon.png") };

export default function WelcomeScreen() {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.bg }}>
            <View className="flex-1 justify-center items-center">
                <Text className="text-center text-white font-bold text-2xl">
                    Bienvenido a MoodClothingAI
                </Text>
                <View className="flex-row justify-center items-center mt-4">
                    <Image source={images.icon} style={{ width: 80, height: 80 }} />
                </View>    
                <View className="space-y-4 mt-6">
                    <TouchableOpacity onpress={() => navigation.navigate("SignUp")} className="bg-blue-500 py-2 px-4 rounded">
                        <Text className="text-white font-bold text-center">Registrarse</Text> {/*Sign up*/}
                    </TouchableOpacity>    
                    <View className="flex justify-center">
                        <Text className="font-semibold text-white">¿Ya tienes una cuenta?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                            <Text className="text-blue-500 font-bold"> Iniciar sesión</Text> {/*Log in*/}
                        </TouchableOpacity>
                    </View>
                    <View className="flex justify-center">W

                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}