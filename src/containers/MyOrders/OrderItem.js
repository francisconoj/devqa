/** @format */

import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Tools, Languages } from '@common';
import styles from './styles';
export default class OrderItem extends React.PureComponent {
  getDateCreated() {
    const { order } = this.props;
    const date = new Date(order.date_created);
    const sep = '/';
    return `${date.getDate()}${sep}${date.getMonth()+1}${sep}${date.getFullYear()}`;
  }
  getShippingAddress() {
    const { order } = this.props;
    const shipping = order.shipping ? order.shipping : {};
    var address = '';
    if (shipping.address_1 != '') {
      address += shipping.address_1;
    }
    if (address === '' && shipping.address_2 != '') {
      address += shipping.address_2;
    }
    if (address === '' && shipping.city != '') {
      address += shipping.city;
    }
    if (address === '' && shipping.state != '') {
      address += shipping.state;
    }
    return address;
  }
  getOrderTotal() {
    const { order } = this.props;
    return Tools.getCurrecyFormatted(order.total);
  }
  getOrderStatus() {
    const { order } = this.props;
    switch (order.status.toUpperCase()) {
      case 'CANCELLED':
        return {
          text: Languages.cancelled,
          icon: '\uf00d',
        };
      case 'COMPLETED':
        return {
          text: Languages.completed,
          icon: '\uf015',
        };
      case 'PROCESSING':
        return {
          text: Languages.processing,
          icon: '\uf017',
        };
      case 'FACTURADO':
        return {
          text: Languages.invoiced,
          icon: '\uf15c',
        };
        case 'PENDING':
        return {
          text: Languages.pending,
          icon: '\uf09d',
        };
      default:
        return {
          text: Languages.processing,
          icon: '\uf017',
        };
    }
  }
  onOrderPressed() {
    const { order } = this.props;
    this.props.onViewOrderDetail(order.id);
  }
  render() {
    const { order } = this.props;
    const status = this.getOrderStatus();
    return (
      <TouchableOpacity
        style={styles.order}
        onPress={this.onOrderPressed.bind(this)}
      >
        <View style={styles.orderHeaderRow}>
          <Text style={styles.orderId}>{`Orden #${order.id}`}</Text>
          <Text style={styles.orderDateCreated}>{this.getDateCreated()}</Text>
        </View>
        <View style={styles.orderHeaderRow}>
          <Text style={styles.orderShippingAddress}>
            {this.getShippingAddress()}
          </Text>
          <Text style={styles.orderTotal}>{this.getOrderTotal()}</Text>
        </View>
        <View style={styles.orderStatus}>
          <View style={styles.orderStatusIcon}>
            <View style={styles.orderStatusIconColor}>
              <Text style={styles.orderStatusIconText}>{status.icon}</Text>
            </View>
          </View>
          <Text style={styles.orderStatusText}>{status.text}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}
