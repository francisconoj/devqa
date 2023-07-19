/** @format */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import { WooWorker } from 'api-ecommerce';
import Reactotron from 'reactotron-react-native';
import { has, isArray } from 'lodash';
import { toast, warn } from '@app/Omni';
import { ConfirmCheckout } from '@components';
import { Config, Languages, Tools, withTheme } from '@common';
import Buttons from '@cart/Buttons';
import PaymentMethods from './PaymentMethods';
import { isEmpty } from "lodash";
import styles from './styles';
class PaymentOptions extends PureComponent {
  static propTypes = {
    fetchPayments: PropTypes.func,
    message: PropTypes.array,
    type: PropTypes.string,
    cleanOldCoupon: PropTypes.func,
    onNext: PropTypes.func,
    user: PropTypes.object,
    userInfo: PropTypes.object,
    currency: PropTypes.any,
    payments: PropTypes.object,
    isLoading: PropTypes.bool,
    cartItems: PropTypes.any,
    onShowCheckOut: PropTypes.func,
    emptyCart: PropTypes.func,
    couponCode: PropTypes.any,
    couponId: PropTypes.any,
    couponAmount: PropTypes.any,
    shippingMethod: PropTypes.any,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      paymentData: {},
      paymentMethod: {},
    };
  }

  UNSAFE_componentWillMount() {
    this.props.fetchPayments();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.message && nextProps.message.length > 0) {
      toast(nextProps.message);
    }
    if (
      nextProps.type !== this.props.type &&
      nextProps.type === 'CREATE_NEW_ORDER_SUCCESS'
    ) {
      warn(nextProps);
      this.props.cleanOldCoupon();
      this.props.onNext();
    }
  }
  zonePostCode(city, postCode) {
    let zone = '';
    if (city === 'Guatemala') {
      zone = ', zona ';
      switch (postCode) {
        case '01001':
          zone += '1';
          break;
        case '01002':
          zone += '2';
          break;
        case '01003':
          zone += '3';
          break;
        case '01004':
          zone += '4';
          break;
        case '01005':
          zone += '5';
          break;
        case '01006':
          zone += '6';
          break;
        case '01007':
          zone += '7';
          break;
        case '01008':
          zone += '8';
          break;
        case '01009':
          zone += '9';
          break;
        case '01010':
          zone += '10';
          break;
        case '01011':
          zone += '11';
          break;
        case '01012':
          zone += '12';
          break;
        case '01013':
          zone += '13';
          break;
        case '01014':
          zone += '14';
          break;
        case '01015':
          zone += '15';
          break;
        case '01016':
          zone += '16';
          break;
        case '01017':
          zone += '17';
          break;
        case '01018':
          zone += '18';
          break;
        case '01019':
          zone += '19';
          break;
        case '01021':
          zone += '21';
          break;

      }
    }
    return zone;
  }
  nextStep() {
    const {
      userInfo,
      currency,
      payments: { list },
      user: { user, token },
    } = this.props;
    const { paymentMethod } = this.state;
    const coupon = this.getCouponInfo();



    // Billing First name is a required field.
    // Billing Last name is a required field.
    // Billing Country is a required field.
    // Billing Street address is a required field.
    // Billing Town / City is a required field.

    const payload = {
      token,
      customer_id: this.props.user.user.id,
      set_paid: false,
      payment_method: paymentMethod.id,
      payment_method_title: paymentMethod.title,
      meta_data: [{ key: '_billing_nit', value: userInfo.billingNit }],
      billing: {
        //  ...(user ? user.billing : null),

        first_name: userInfo.first_name,
        address_1: userInfo.address_1,
        last_name: userInfo.last_name,
        city: userInfo.city,
        state: userInfo.state,
        email: userInfo.email,
        phone: userInfo.phone,
        postcode: userInfo.postcode,

      },
      shipping: {
        first_name: userInfo.first_name,
        last_name: userInfo.last_name,
        address_1: userInfo.address_1 + this.zonePostCode(userInfo.city, userInfo.postcode),
        city: userInfo.city,
        state: userInfo.state,
        country: userInfo.country,
        postcode: userInfo.postcode,
        email: userInfo.email,
        phone: userInfo.phone
      },
      line_items: Tools.getItemsToCheckout(this.props.cartItems),
      customer_note: typeof userInfo.note !== 'undefined' ? userInfo.note : '',
      currency: currency.code,
    };

    // check the shipping info
    if (Config.shipping.visible) {
      payload.shipping_lines = this.getShippingMethod();
    }

    // check the coupon
    if (coupon.length !== 0) {
      payload.coupon_lines = this.getCouponInfo();
    }

    this.setState({ loading: this.props.isLoading });

    // warn([userInfo, payload]);

    Reactotron.log('payload', payload);
    this.props.onShowNativeOnePageCheckOut(payload);

    /* if (paymentMethod.id === 'cod') {
       this.setState({ loading: true });
       WooWorker.createNewOrder(
         payload,
         () => {
           this.setState({ loading: false });
           this.props.emptyCart();
           this.props.onNext();
         },
         () => {
           warn('failure');
           toast(Languages.CreateOrderError);
           this.setState({ loading: false });
         }
       );
     } else if (Config.NativeOnePageCheckout) {
       // other kind of payment
       Reactotron.log('payload', payload);
       this.props.onShowNativeOnePageCheckOut(payload);
     } else {
       // other kind of payment
       Reactotron.log('payload', payload);
       this.props.onShowCheckOut(payload);
     }*/
  }

  getCouponInfo = () => {
    const { couponCode, couponAmount } = this.props;
    if (
      typeof couponCode !== 'undefined' &&
      typeof couponAmount !== 'undefined' &&
      couponAmount > 0
    ) {
      return [
        {
          code: couponCode,
          discount: `${couponAmount}`,
        },
      ];
    }
    return [];
  };

  getShippingMethod = () => {
    const { shippingMethod } = this.props;
    if (typeof shippingMethod !== 'undefined') {
      return [
        {
          method_id: `${shippingMethod.method_id}:${shippingMethod.id}`,
          method_title: shippingMethod.title,
          total:
            shippingMethod.id === 'free_shipping' ||
              shippingMethod.method_id === 'free_shipping'
              ? '0'
              : shippingMethod.settings.cost.value,
        },
      ];
    }
    // return the free class as default
    return [
      {
        method_id: 'free_shipping',
        total: '0',
      },
    ];
  };

  onPaymentMethodChanged(paymentMethod) {
    this.setState({ paymentMethod, paymentData: {} });
  }

  onPaymentDataChanged(paymentData) {
    this.setState({ paymentData });
  }

  render() {
    const { payments, onPrevious } = this.props;
    const { paymentMethod, paymentData, loading } = this.state;
    return (
      <KeyboardAvoidingView style={styles.container}>
        <ScrollView keyboardShouldPersistTaps="handled">

          <ConfirmCheckout
            couponAmount={this.props.couponAmount}
            discountType={this.props.discountType}
            shippingPrice={this.getShippingPrice()}
            totalPrice={this.getTotalPrice()}
            subTotal={this.getSubTotal()}
            currency={this.props.currency}
          />
        </ScrollView>
        <Buttons
          isAbsolute
          onPrevious={onPrevious}
          isLoading={loading}
          nextText={Languages.ConfirmOrder}
          onNext={this.nextStep.bind(this)}
        />
      </KeyboardAvoidingView>
    );
  }

  getExistCoupon = () => {
    const { couponCode, couponAmount, discountType, productIds } = this.props;
    if (couponCode && isEmpty(productIds)) {
      if (discountType === "percent") {
        return couponAmount / 100.0;
      }
      return couponAmount;
    }
    return 0;
  };

  getShippingPrice() {
    const { freeShipping } = this.props;
    const shippingMethod = this.getShippingMethod();
    const hasFreeShipping = freeShipping === undefined ? false : freeShipping;
    if (hasFreeShipping) {
      return 0;
    }
    else {
      return shippingMethod && isArray(shippingMethod)
        ? shippingMethod[0].total
        : shippingMethod;
    }
  }

  getSubTotal() {
    const { cartItems, currency } = this.props;
    let price = 0;
    cartItems.forEach((cart) => {
      const product =
        cart.variation && cart.variation.price !== ''
          ? cart.variation
          : cart.product;
      const productPrice = Tools.getMultiCurrenciesPrice(product, currency);
      price += productPrice * cart.quantity;
    });

    return this.props.totalPrice;
  }


  getTotalPrice = () => {
    const { cartItems, currency, productIds, couponAmount, discountType } = this.props;
    let total = 0;
    const shippingPrice = this.getShippingPrice();
    if (!isEmpty(productIds)) {
      cartItems.forEach((cart) => {
        const product =
          cart.variation && cart.variation.price !== ""
            ? cart.variation
            : cart.product;
        const productPrice = Tools.getMultiCurrenciesPrice(product, currency);
        let isDesct = false;
        productIds.forEach((item) => {
          if (product.id === item) {
            isDesct = true;
            total += (productPrice - (couponAmount / 100.0) * productPrice) * cart.quantity;
          }
        });
        if (!isDesct) {
          total += productPrice * cart.quantity;
        }
      });
    }
    else {
      cartItems.forEach((cart) => {
        const product =
          cart.variation && cart.variation.price !== ""
            ? cart.variation
            : cart.product;
        const productPrice = Tools.getMultiCurrenciesPrice(product, currency);
        total += productPrice * cart.quantity;
      });
    }
    total = this.props.totalPrice;
    const finalPrice =
      discountType === "percent"
        ? total - this.getExistCoupon() * total
        : total - this.getExistCoupon();
    return parseFloat(finalPrice) +
      parseFloat(shippingPrice);
  };

}

const mapStateToProps = ({ payments, carts, user, products, currency }) => {
  return {
    payments,
    user,
    type: carts.type,
    cartItems: carts.cartItems,
    totalPrice: carts.totalPrice,
    message: carts.message,
    customerInfo: carts.customerInfo,
    couponCode: products.coupon && products.coupon.code,
    couponAmount: products.coupon && products.coupon.amount,
    discountType: products.coupon && products.coupon.type,
    couponId: products.coupon && products.coupon.id,
    shippingMethod: carts.shippingMethod,
    currency,
    productIds: products.coupon && products.coupon.productIds,
    freeShipping: products.coupon && products.coupon.freeShipping
  };
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  const { dispatch } = dispatchProps;
  const CartRedux = require('@redux/CartRedux');
  const productActions = require('@redux/ProductRedux').actions;
  const paymentActions = require('@redux/PaymentRedux').actions;
  return {
    ...ownProps,
    ...stateProps,
    emptyCart: () => CartRedux.actions.emptyCart(dispatch),
    createNewOrder: (payload) => {
      CartRedux.actions.createNewOrder(dispatch, payload);
    },
    cleanOldCoupon: () => {
      productActions.cleanOldCoupon(dispatch);
    },
    fetchPayments: () => {
      paymentActions.fetchPayments(dispatch);
    },
  };
}

export default connect(
  mapStateToProps,
  undefined,
  mergeProps
)(withTheme(PaymentOptions));
