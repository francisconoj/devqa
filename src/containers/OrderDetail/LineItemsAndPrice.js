/** @format */

import React from 'react';
import { View, Text } from 'react-native';
import { get } from 'lodash';
import { Color, Tools } from '@common';
import styles from './styles';

export default class LineItemsAndPrice extends React.PureComponent {
  getSubTotal() {
    const { order } = this.props;
    const cartItems = get(order, 'line_items');
    let price = 0;
    cartItems &&
      cartItems.forEach((item) => {
        price += item.price * item.quantity;
      });
    return Tools.getCurrecyFormatted(price);
  }

  getShippingTotal() {
    const { order } = this.props;
    return Tools.getCurrecyFormatted(order.shipping_total);
  }

  getOrderTotal() {
    const { order } = this.props;
    return Tools.getCurrecyFormatted(order.total);
  }

  render() {
    const { order } = this.props;
    return (
      <View>
        <View style={[styles.propertyContainer, { flexDirection: 'column' }]}>
          <Text style={styles.propertyName}>{'Carrito'}</Text>
          <View style={styles.itemContainer}>
            {order.line_items.map((o, i) => {
              return (
                <View key={i.toString()} style={styles.lineItem}>
                  <Text
                    style={styles.name(Color.text)}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {o.name}
                  </Text>
                  <Text
                    style={styles.text(Color.text)}
                  >{`x${o.quantity}`}</Text>
                  <Text style={styles.text(Color.text)}>
                    {Tools.getCurrecyFormatted(o.total)}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
        <View
          style={[
            styles.propertyContainer,
            { borderBottomWidth: 0, paddingBottom: 0 },
          ]}
        >
          <Text style={styles.propertyName}>{'Productos'}</Text>
          <Text style={styles.propertyValue}>{this.getSubTotal()}</Text>
        </View>
        <View
          style={[
            styles.propertyContainer,
            {
              borderBottomColor: '#f1f1f1',
              paddingTop: 0,
              paddingBottom: 12,
            },
          ]}
        >
          <Text style={styles.propertyName}>{'Entrega'}</Text>
          <Text style={styles.propertyValue}>{this.getShippingTotal()}</Text>
        </View>
        <View style={styles.propertyContainer}>
          <Text style={styles.propertyName}>{'Total'}</Text>
          <Text style={styles.propertyValue}>{this.getOrderTotal()}</Text>
        </View>
      </View>
    );
  }
}
