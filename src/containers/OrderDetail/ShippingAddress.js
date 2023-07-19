/** @format */

import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';
export default class ShippingAddress extends React.PureComponent {
  getShippingAddress() {
    const { order } = this.props;
    const shipping = order.shipping ? order.shipping : {};
    var address = '';
    if (shipping.address_1 != '') {
      address += shipping.address_1 + ', ';
    }
    if (shipping.address_2 != '') {
      address += shipping.address_2 + ', ';
    }
    if (shipping.city != '') {
      address += shipping.city + ', ';
    }
    if (shipping.state != '') {
      address += shipping.state;
    }
    return address;
  }
  render() {
    return (
      <View style={[styles.propertyContainer, { flexDirection: 'column' }]}>
        <Text style={styles.propertyName}>{'Dirección de entrega'}</Text>
        <Text style={[styles.propertyValue, { textAlign: 'left' }]}>
          {this.getShippingAddress()}
        </Text>
      </View>
    );
  }
}
