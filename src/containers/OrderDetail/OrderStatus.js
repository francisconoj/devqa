/** @format */

import React from 'react';
import { View, Text } from 'react-native';

import { Languages } from '@common';
import styles from './styles';

export default class OrderStatus extends React.PureComponent {
  render() {
    const { order } = this.props;
    const text = (() => {
      switch (order.status.toUpperCase()) {
        case 'CANCELLED':
          return {
            status: Languages.cancelled,
            hint: 'Tu orden fué cancelada.',
          };
        case 'COMPLETED':
          return {
            status: Languages.completed,
            hint: 'Tu orden fué entregada.',
          };
        case 'PROCESSING':
          return {
            status: Languages.processing,
            hint: 'Tu orden será enviada pronto.',
          };
        case 'FACTURADO':
          return {
            status: Languages.invoiced,
            hint: 'Tu orden ha sido facturada y será enviada pronto.',
          };
        case 'PENDING':
          return {
            status: Languages.pending,
            hint: 'Tu pago no ha sido procesado vuelve a intentarlo.',
          };
        default:
          return {
            status: Languages.processing,
            hint: 'Tu orden será enviada pronto.',
          };
      }
    })();
    return (
      <View style={styles.statusContainer}>
        <View style={styles.status}>
          <Text style={styles.statusText}>{text.status}</Text>
        </View>
        <Text style={styles.statusHint}>{text.hint}</Text>
      </View>
    );
  }
}
