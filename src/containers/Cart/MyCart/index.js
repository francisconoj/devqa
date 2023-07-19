/** @format */

import React, { PureComponent } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { connect } from "react-redux";
import { SwipeRow } from "react-native-swipe-list-view";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { LinearGradient } from "@expo";

import { toast, FacebookAPI } from "@app/Omni";
import { ProductItem, Spinner } from "@components";
import { Languages, Color, withTheme, Tools } from "@common";
import css from "@cart/styles";
import styles from "./styles";
import { isEmpty } from "lodash";
import { WooWorker } from "api-ecommerce";
import * as SecureStore from 'expo-secure-store';
import WPUserAPI from "@services/WPUserAPI";
import { has, get } from "lodash";
import moment from "moment";
async function save(key, value) {
  await SecureStore.setItemAsync(key, value);
}

async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    return result;
  } else {
    return null;
  }
}


class MyCart extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      coupon: props.couponCode,
      isLoading: false,
      couponvisible: false
    };

  }

  async componentDidMount() {
    //this.logOutApp();
    await this.login();


  }

  getCodesCoupons = () => {
    if (this.props.coupons) {
      this.props.coupons.forEach((item) => {
        const dateExpires = moment(item.date_expires);
        const today = moment();
        if (dateExpires.diff(today) > 0) {
          item.email_restrictions.forEach((emal) => {
            if (emal === this.props.user.user.email) {

              if (!this.state.couponvisible) {
                this.setState({ coupon: item.code });
                toast("Se te ha precargado un cupón de Q" + item.amount + " utilízalo con una compra mínima de Q" + item.minimum_amount);
                this.setState({ couponvisible: true });
              }
            }
          });
        }
      });
    }
    else {
      this.props.getCoupons();
    }


    //  [0].email_restrictions
  }

  login = async () => {
    const { applogin, navigation } = this.props;
    //   navigation.navigate("LoginScreen", { isLogout: true });
    if (this.props.user) {
      try {
        let type = (await getValueFor("typeLogin")).toString();

        if (type) {
          if (type === 'normal') {
            let userName = (await getValueFor("userName")).toString();
            let token = (await getValueFor("token")).toString();
            const json = await WPUserAPI.login(userName, token);
            let customers = await WooWorker.getCustomerById(get(json, "user.id"));
            customers = { ...customers, username: userName, password: token };
            applogin(customers, json.cookie);
          }
          else if (type === 'fb') {
            const json = await WPUserAPI.ReloginFacebook(this.props.user.user.email);
            let customers = await WooWorker.getCustomerById(json.wp_user_id);
            applogin(customers, json.cookie);
          }
          else if (type === 'apple') {
            let email = (await getValueFor("email")).toString();
            let fullName1 = (await getValueFor("fullName")).toString();
            let user = (await getValueFor("user")).toString();
            if (email) {
              const json = await WPUserAPI.appleLogin(
                email,
                fullName1,
                user
              );
              let customers = await WooWorker.getCustomerById(json.wp_user_id);
              applogin(customers, json.cookie);
            }
          }
          else if (type === 'google') {
            let email = (await getValueFor("emailG")).toString();
            let fullName1 = (await getValueFor("fullNameG")).toString();
            let user = (await getValueFor("userG")).toString();
            if (email) {
              const json = await WPUserAPI.appleLogin(
                email,
                fullName1,
                user
              );
              let customers = await WooWorker.getCustomerById(json.wp_user_id);
              applogin(customers, json.cookie);
            }
          }
        }
        else {
          this.logOutApp();
        }
      }
      catch (error) {
        //navigation.navigate("LoginScreen", { isLogout: true });
        // alert("error" + error)
        this.logOutApp();
        console.log("error al intentar realizar el login: " + error);
      }
    }


  }
  logOutApp() {
    this.props.logout();
    try {
      if (FacebookAPI.getAccessToken()) {
        FacebookAPI.logout();
      }
    }
    catch (error) { }

  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.hasOwnProperty("type") &&
      nextProps.type === "GET_COUPON_CODE_FAIL"

    ) {
      toast(nextProps.message);
      this.setState({ isLoading: false });
    }
    if (
      nextProps.hasOwnProperty("type") &&
      nextProps.type === "GET_COUPON_CODE_SUCCESS"
    ) {

      this.setState({ isLoading: false });
    }
  }

  render() {
    const { cartItems, isFetching, discountType } = this.props;
    const {
      theme: {
        colors: { text, lineColor },
        dark,
      },
      currency,
    } = this.props;

    let couponBtn = Languages.ApplyCoupon;
    let colors = [Color.secondary, Color.secondary, Color.secondary];
    const totalPrice = this.props.totalPrice;
    const finalPrice =
      discountType === "percent"
        ? totalPrice - this.getExistCoupon() * totalPrice
        : totalPrice - this.getExistCoupon();

    if (isFetching) {
      couponBtn = Languages.ApplyCoupon;
    } else if (this.getExistCoupon2() > 0) {
      colors = [Color.primary, Color.primary];
      couponBtn = Languages.remove;
    }
    this.getCodesCoupons();

    var date = new Date();
    date.setDate(date.getDate() + 1);
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={css.row}>
            <Text style={[css.label2, { color: text, textAlign:"center" }]}>
              {Languages.labelOrder.replace('{date}', moment(date ).format('DD/MM/YYYY'))}
            </Text>
          </View>
          <View style={css.row}>

            <Text style={[css.label, { color: text }]}>
              {Languages.TotalPrice}
            </Text>
            <Text style={[css.value, { color: Color.primary }]}>
              {Tools.getCurrecyFormatted(finalPrice, currency)}
            </Text>
          </View>
          <View style={styles.list}>
            {cartItems &&
              cartItems.sort((a, b) => a.product.problem - b.product.problem).map((item, index) => (
                <SwipeRow
                  key={index.toString()}
                  disableRightSwipe
                  leftOpenValue={75}
                  rightOpenValue={-75}>
                  {this.renderHiddenRow(item, index)}
                  <ProductItem
                    key={index.toString()}
                    viewQuantity
                    product={item.product}
                    onPress={() =>
                      this.props.onViewProduct({ product: item.product })
                    }
                    variation={item.variation}
                    quantity={item.quantity}
                    onRemove={this.props.removeCartItem}
                    currency={currency}
                  />
                </SwipeRow>
              ))}
          </View>
          <View style={[styles.couponView(dark)]}>
            <Text style={[css.label, { color: text }]}>
              {Languages.CouponPlaceholder}
            </Text>
            <View style={styles.row}>
              <TextInput
                value={this.state.coupon}
                placeholder={Languages.CouponPlaceholder}
                onChangeText={(coupon) => this.setState({ coupon })}
                style={[
                  styles.couponInput,
                  { backgroundColor: lineColor },
                  { color: text },
                  this.getExistCoupon() > 0 && {
                    backgroundColor: Color.lightgrey,
                  },
                ]}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                editable={this.getExistCoupon() === 0}
              />

              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => this.checkCouponCode()}
                disabled={this.state.coupon.length === 0}>
                <LinearGradient colors={colors} style={styles.btnApply}>
                  <Text style={styles.btnApplyText}>{couponBtn}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            {this.getExistCoupon2() > 0 && (
              <Text style={styles.couponMessage}>
                {Languages.applyCouponSuccess + this.getCouponString() + " de descuento."}
              </Text>
            )}
          </View>
        </ScrollView>
        {this.state.isLoading ? <Spinner mode="full" color="black" /> : null}
      </View>
    );
  }

  renderHiddenRow = (rowData, index) => {
    return (
      <TouchableOpacity
        key={`hiddenRow-${index}`}
        style={styles.hiddenRow}
        onPress={() =>
          this.props.removeCartItem(rowData.product, rowData.variation)
        }>
        <View style={{ marginRight: 23 }}>
          <FontAwesome name="trash" size={30} color="white" />
        </View>
      </TouchableOpacity>
    );
  };

  checkProductsDiscount = () => {
    let totalPromotion = 0;

    this.props.cartItems.map((item) => {
      let haspromotion;
      if (item.product.on_sale) {
        haspromotion = true;
      }

      this.props.promotions.map((promotion) => {
        if (promotion.method === 'bogo_xx_repeat' && promotion.exclusivity === 'all') {

          promotion.conditions.map((condition) => {
            if ("product__product" === condition.type) {
              condition.products.map((product) => {
                if (product == item.product.id) {
                  //  alert("PROMOCION");
                  haspromotion = true;
                }
              });
            }
          });
        }/////
      });
      if (!haspromotion) {
        totalPromotion += (item.product.price * item.quantity);
      }
    });
    return totalPromotion;
  }

  getPromotionByProduct = () => {
    let totalPromotion = 1;
    this.props.promotions.list.map((promotion) => {
      if (promotion.method === 'bogo_xx_repeat' && promotion.exclusivity === 'all') {
        promotion.conditions.map((condition) => {
          if ("product__product" === condition.type) {
            condition.products.map((product) => {
              if (this.props.product.id == product) {
                totalPromotion = promotion.bogo_purchase_quantity + promotion.bogo_receive_quantity;
              }
            });
          }
        });
      }
    });
    return totalPromotion;
  }


  checkCouponCode = () => {
    // this.checkProductsDiscount();
    const { totalPrice } = this.props;
    this.setState({ isLoading: true });
    if (this.getExistCoupon() === 0) {

      this.props.getCouponAmount(this.state.coupon, this.checkProductsDiscount());
    } else {
      this.setState({ coupon: "" });
      this.props.cleanOldCoupon();
    }
  };

  getCouponString = () => {
    const { discountType } = this.props;
    const couponValue = this.getExistCoupon2();
    if (discountType === "percent") {
      return `${couponValue * 100}%`;
    }
    return Tools.getCurrecyFormatted(couponValue);
  };

  getExistCoupon = () => {
    const { couponCode, couponAmount, discountType, productIds } = this.props;
    if (couponCode === this.state.coupon && isEmpty(productIds)) {
      if (discountType === "percent") {
        return couponAmount / 100.0;
      }
      return couponAmount;
    }
    return 0;
  };

  getExistCoupon2 = () => {
    const { couponCode, couponAmount, discountType } = this.props;
    if (couponCode === this.state.coupon) {
      if (discountType === "percent") {
        return couponAmount / 100.0;
      }
      return couponAmount;
    }
    return 0;
  }

  getTotalPrice = () => {
    const { cartItems, currency, productIds, couponAmount } = this.props;
    let total = 0;
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
    return total;
  };
}

MyCart.defaultProps = {
  couponCode: "",
  couponAmount: 0,
};

const mapStateToProps = ({ carts, products, currency, user, promotions }) => {
  return {
    user,
    cartItems: carts.cartItems,
    totalPrice: carts.totalPrice,
    couponCode: products.coupon && products.coupon.code,
    couponAmount: products.coupon && products.coupon.amount,
    discountType: products.coupon && products.coupon.type,
    productIds: products.coupon && products.coupon.productIds,
    isFetching: products.isFetching,
    type: products.type,
    message: products.message,
    currency,
    promotions: promotions.list,
    coupons: products.coupons
  };
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  const { dispatch } = dispatchProps;
  const { actions } = require("@redux/CartRedux");
  const productActions = require("@redux/ProductRedux").actions;
  const UserRedux = require("@redux/UserRedux");
  return {
    ...ownProps,
    ...stateProps,
    removeCartItem: (product, variation) => {
      actions.removeCartItem(dispatch, product, variation);
    },
    cleanOldCoupon: () => {
      productActions.cleanOldCoupon(dispatch);
    },
    getCouponAmount: (coupon, totalPrice) => {
      productActions.getCouponAmount(dispatch, coupon, totalPrice);
    },
    applogin: (user, token) => { dispatch(UserRedux.actions.login(user, token)) },
    logout: () => dispatch(UserRedux.actions.logout()),
    getCoupons: () => {
      productActions.getCoupons(dispatch);
    },

  };
}

export default connect(
  mapStateToProps,
  undefined,
  mergeProps
)(withTheme(MyCart));
