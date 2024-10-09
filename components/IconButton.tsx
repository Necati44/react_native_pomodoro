import React, { useState, useEffect } from "react";
import {
  View,
  ViewProps,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

export type IconButtonProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  onPress: () => void;
  title?: string;
  icon: React.ReactElement;
};

export function IconButton({
  style,
  lightColor,
  darkColor,
  onPress,
  title,
  icon,
  ...otherProps
}: IconButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[{ justifyContent: "center", alignItems: "center" }]}
    >
      {title && <ThemedText>{title}</ThemedText>}
      {icon}
    </TouchableOpacity>
  );
}
