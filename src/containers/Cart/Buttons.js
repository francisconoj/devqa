/** @format */

import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';

import { Languages, withTheme, Color } from '@common';
import styles from './styles';

const Buttons = ({
  isAbsolute,
  onPrevious,
  isLoading,
  nextText,
  onNext,
  theme,
}) => {
  const {
    colors: { text, lineColor },
    dark: isDark,
  } = theme;

  return (
    <View
      style={[
        styles2.bottomView,
        isAbsolute && styles.floatView,
        isDark && { borderTopColor: lineColor },
      ]}
    >
      <TouchableOpacity style={styles2.backButton} onPress={onPrevious}>
        <Text style={styles2.icon}>{'\uf053'}</Text>
        <Text style={styles2.text}>{'Regresar'}</Text>
      </TouchableOpacity>
      {isLoading ? (
        <View style={styles.btnBuy}>
          <Animatable.Text
            style={[styles.btnBuyText, isDark && { color: text }]}
            animation="pulse"
            iterationCount="infinite"
          >
            {Languages.Loading}
          </Animatable.Text>
        </View>
      ) : (
        <TouchableOpacity style={styles2.nextButton} onPress={onNext}>
          <Text style={[styles2.text, { color: '#ffffff' }]}>
            {'Siguiente'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles2 = StyleSheet.create({
  bottomView: {
    height: 48,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f3f7f9',
  },
  backButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  nextButton: {
    flex: 1,
    backgroundColor: Color.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    padding: 6,
    fontFamily: 'FuturaBold',
    color: '#999999',
    fontSize: 14,
  },
  icon: {
    padding: 6,
    fontFamily: 'FontAwesome',
    fontSize: 16,
    color: '#999999',
  },
});

export default withTheme(Buttons);
