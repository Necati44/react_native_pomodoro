import React from "react";
import { ViewProps, TouchableOpacity } from "react-native";
import { ThemedText } from "./ThemedText";

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
