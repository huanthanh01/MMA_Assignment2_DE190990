import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { styles } from "../components/styles/index.styles";
import { AppColors } from "../constants/colors";

// Import modular components
import { BrandPanel } from "../components/BrandPanel";
import { LoginForm } from "../components/LoginForm";
import { RegisterForm } from "../components/RegisterForm";
import { useAppContext } from "../controllers/useAppController";

export default function LoginScreen() {
  const {
    isLargeScreen,
    isSignUp,
    setIsSignUp,
    handleLoginSuccess,
    handleRegisterSuccess,
    handleSocialLogin,
    brandTranslateX,
    formTranslateX,
    loginOpacity,
    loginTranslateY,
    registerOpacity,
    registerTranslateY,
  } = useAppContext();

  return (
    <LinearGradient
      colors={AppColors.gradientLogin as any}
      style={styles.authContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Animated background shape simulations */}
      <View style={[styles.bgShape, styles.bgShape1]} />
      <View style={[styles.bgShape, styles.bgShape2]} />
      <View style={[styles.bgShape, styles.bgShape3]} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.authScroll}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[styles.authCard, isLargeScreen && styles.authCardLarge]}
          >
            {/* Branding Panel (Slides only on desktop, remains fixed on mobile) */}
            <Animated.View
              style={[
                styles.brandPanel,
                isLargeScreen && styles.brandPanelLarge,
                {
                  transform: [
                    { translateX: isLargeScreen ? brandTranslateX : 0 },
                  ],
                },
              ]}
            >
              <BrandPanel
                isSignUp={isSignUp}
                onToggle={() => setIsSignUp(!isSignUp)}
              />
            </Animated.View>

            {/* Forms Section */}
            <Animated.View
              style={[
                styles.formPanel,
                isLargeScreen && styles.formPanelLarge,
                {
                  transform: [
                    { translateX: isLargeScreen ? formTranslateX : 0 },
                  ],
                },
              ]}
            >
              {/* Login Form Container */}
              <Animated.View
                pointerEvents={!isSignUp ? "auto" : "none"}
                style={{
                  opacity: loginOpacity,
                  transform: [{ translateY: loginTranslateY }],
                  position: isSignUp ? "absolute" : "relative",
                  width: "100%",
                  alignSelf: "center",
                }}
              >
                <LoginForm
                  onLoginSuccess={handleLoginSuccess}
                  onSocialLogin={handleSocialLogin}
                  onToggleSignUp={() => setIsSignUp(true)}
                />
              </Animated.View>

              {/* Register Form Container */}
              <Animated.View
                pointerEvents={isSignUp ? "auto" : "none"}
                style={{
                  opacity: registerOpacity,
                  transform: [{ translateY: registerTranslateY }],
                  position: !isSignUp ? "absolute" : "relative",
                  width: "100%",
                  alignSelf: "center",
                }}
              >
                <RegisterForm
                  onRegisterSuccess={handleRegisterSuccess}
                  onSocialLogin={handleSocialLogin}
                  onToggleLogin={() => setIsSignUp(false)}
                />
              </Animated.View>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
