/** @format */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import { Tools } from '@common';
import styles from './styles';

class ConfirmCheckout extends PureComponent {
  static propTypes = {
    subTotal: PropTypes.any,
    shippingPrice: PropTypes.any,
    totalPrice: PropTypes.any,
    discountType: PropTypes.any,
    couponAmount: PropTypes.any,
    taxPrice: PropTypes.any,
    currency: PropTypes.any,
  };

  getSubTotal() {
    const { subTotal, currency } = this.props;
    return Tools.getCurrecyFormatted(subTotal, currency);
  }

  getShippingTotal() {
    const { shippingPrice, currency } = this.props;
    return shippingPrice === 0 ? "Q0.00" : Tools.getCurrecyFormatted(shippingPrice, currency);
  }

  getOrderTotal() {
    const { totalPrice, currency } = this.props;
    return Tools.getCurrecyFormatted(totalPrice, currency);
  }

  getCouponTotal() {
    const { discountType, couponAmount, currency } = this.props;
    return discountType === 'percent'
      ? `${parseFloat(couponAmount)}%`
      : Tools.getCurrecyFormatted(couponAmount, currency);
  }

  getTaxTotal() {
    const { taxPrice, currency } = this.props;
    return Tools.getCurrecyFormatted(taxPrice, currency);
  }

  render() {
    const { couponAmount, taxPrice } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.propertyContainer}>
          <Text style={styles.propertyName}>{'Productos'}</Text>
          <Text style={styles.propertyValue}>{this.getSubTotal()}</Text>
        </View>
        {couponAmount > 0 && (
          <View style={styles.propertyContainer}>
            <Text style={styles.propertyName}>{'Cupones'}</Text>
            <Text style={styles.propertyValue}>{this.getCouponTotal()}</Text>
          </View>
        )}
        <View style={styles.propertyContainer}>
          <Text style={styles.propertyName}>{'Envío'}</Text>
          <Text style={styles.propertyValue}>{this.getShippingTotal()}</Text>
        </View>
        {taxPrice && (
          <View style={styles.propertyContainer}>
            <Text style={styles.propertyName}>{'Impuestos'}</Text>
            <Text style={styles.propertyValue}>{this.getTaxTotal()}</Text>
          </View>
        )}
        <View style={[styles.propertyContainer, styles.totalContainer]}>
          <Text style={styles.propertyName}>{'Total'}</Text>
          <Text style={styles.propertyValue}>{this.getOrderTotal()}</Text>
        </View>
      </View>
    );
  }
}

export default ConfirmCheckout;
