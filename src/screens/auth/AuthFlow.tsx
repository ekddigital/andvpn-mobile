import React, { useState } from "react";
import { Linking } from "react-native";
import { SignInScreen } from "./SignInScreen";
import { SignUpScreen } from "./SignUpScreen";

export const AuthFlow: React.FC = () => {
  const [authMode, setAuthMode] = useState<"sign-in" | "sign-up">("sign-in");

  const handleSignUpRedirect = async () => {
    try {
      const url = "https://vpn.andgroupco.com/sign-up";
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        console.error("Cannot open URL:", url);
      }
    } catch (error) {
      console.error("Error opening URL:", error);
    }
  };

  if (authMode === "sign-up") {
    return <SignUpScreen onSignInPress={() => setAuthMode("sign-in")} />;
  }

  return <SignInScreen onSignUpPress={handleSignUpRedirect} />;
};
