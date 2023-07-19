/** @format */

import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';

export default class OrderProperties extends React.PureComponent {
  getDateCreated() {
    const { order } = this.props;
    const date = new Date(order.date_created);
    const sep = '/';
    return `${date.getDate()}${sep}${date.getMonth()+1}${sep}${date.getFullYear()}`;
  }
  render() {
    return (
      <View style={styles.propertyContainer}>
        <Text style={styles.propertyName}>{'Fecha de pedido'}</Text>
        <Text style={styles.propertyValue}>{this.getDateCreated()}</Text>
      </View>
    );
  }
}
