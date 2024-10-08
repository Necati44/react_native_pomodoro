import React from 'react';
import { Link } from 'expo-router';
import {FlatList, StyleSheet, TextProps, View} from 'react-native';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ListPomodoroTimerstProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ListPomodoroTimers ({ lightColor, darkColor }: ListPomodoroTimerstProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'separator');

  const timersList = [
    {workTime: 1200, breakTime: 300},
    {workTime: 2700, breakTime: 900},
  ]

  return (
    <View style={styles.container}>
      <FlatList
        data={timersList}
        renderItem={({item}) =>
          <Link href={{pathname: '/(pages)/timer', params: {breakTime: item.breakTime, workTime: item.workTime} }}>
            <ThemedText style={styles.item}>{item.workTime/60}:{item.breakTime/60}</ThemedText>
          </Link>
        }
        ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: color }]} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  item: {
    padding: 10,
    fontSize: 20,
    height: 44,
  },
  separator: {
    height: 1,
    width: '100%'
  },
});