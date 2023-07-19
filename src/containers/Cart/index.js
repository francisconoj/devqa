/** @format */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { WebView } from 'react-native-webview';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { connect } from 'react-redux';
import base64 from 'base-64';
import Reactotron from 'reactotron-react-native';
import Modal from 'react-native-modalbox';
import { isObject, get } from 'lodash';
import { Styles } from '@common';
import WPUserAPI from "@services/WPUserAPI";
import CustomAPI from '@services/CustomAPI';
import { BlockTimer, toast } from '@app/Omni';
import { StepIndicator } from '@components';
import {
  Languages,
  Images,
  Constants,
  Config,
  withTheme,
  Tools,
  Color
} from '@common';

import MyCart from './MyCart';
import Delivery from './Delivery';
import Payment from './Payment';
import FinishOrder from './FinishOrder';
import PaymentEmpty from './Empty';
import Buttons from './Buttons';
import styles from './styles';
import * as SecureStore from 'expo-secure-store';
import moment from "moment";
import { WooWorker } from "api-ecommerce";

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



class Cart extends PureComponent {
  static propTypes = {
    user: PropTypes.object,
    onMustLogin: PropTypes.func.isRequired,
    finishOrder: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
    onFinishOrder: PropTypes.func.isRequired,
    onViewProduct: PropTypes.func,
    cartItems: PropTypes.array,
    onViewHome: PropTypes.func,
  };

  static defaultProps = {
    cartItems: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      currentIndex: 0,
      // createdOrder: {},
      userInfo: null,
      order: '',
      isLoading: false,
      orderId: null,
      openModal: false,
      checkOutUrl: '',
    };
  }

  UNSAFE_componentWillMount() {
    this.props.navigation.setParams({ title: Languages.ShoppingCart });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // reset current index when update cart item
    if (this.props.cartItems && nextProps.cartItems) {
      if (nextProps.cartItems.length !== 0) {
        if (this.props.cartItems.length !== nextProps.cartItems.length) {
          this.updatePageIndex(0);
          this.onChangeTabIndex(0);
        }
      }
    }
  }

  checkUserLogin = () => {
    const { user } = this.props.user;

    // check anonymous checkout
    if (!Config.Login.AnonymousCheckout) {
      if (user === null) {
        this.props.onMustLogin();
        return false;
      }
    }

    return true;
  };

  onNext = () => {
    const { cartItems } = this.props;
    // check validate before moving next
    let valid = true;
    switch (this.state.currentIndex) {
      case 0:
        {
          if (this.props.totalPrice <= Config.MinimumOrderAmount) {
            toast(Languages.MinimumOrderAmount);
            return;
          }
          for (var item of cartItems) {
            let limit = get(item.product, "manage_stock") ? get(item.product, "stock_quantity") : Constants.LimitAddToCart
            if (item.quantity > limit) {
              toast("Tienes productos que superan el límite disponible");
              return;
            }
          }
          if (Config.EnableOnePageCheckout) {
            const order = {
              line_items: Tools.getItemsToCheckout(this.props.cartItems),
              token:
                this.props.user && this.props.user.token
                  ? this.props.user.token
                  : null,
            };
            const params = base64.encode(
              encodeURIComponent(JSON.stringify(order))
            );
            // alert("pasa por aca?")
            CustomAPI.getCheckoutUrl({ order: params }, (checkOutUrl) => {
              this.setState({ checkOutUrl, openModal: true }, () => {
                this.checkoutModal.open();
              });
            });
            return;
          } else {
            valid = this.checkUserLogin();
          }
        }
        break;

      default:
        break;
    }
    if (valid && typeof this.tabCartView !== 'undefined') {
      const nextPage = this.state.currentIndex + 1;
      this.tabCartView.goToPage(nextPage);
    }
  };

  renderCheckOut = () => {
    const hitSlop = { top: 20, right: 20, bottom: 0, left: 20 };
    const userAgentAndroid =
      'Mozilla/5.0 (Linux; U; Android 4.1.1; en-gb; Build/KLP) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30';
    return (
      <Modal
        ref={(modal) => (this.checkoutModal = modal)}
        coverScreen
        position="top"
        keyboardTopOffset={0}
        backdropPressToClose={false}
        backButtonClose
        transparent={false}
        backdropColor="black"
        swipeToClose={false}
        onClosed={this._onClosedModal}
      >
        <View style={styles.header}>
          <Text style={[Styles.Common.headerStyle, styles.headerTitle]}>
            {'Paga tu orden'}
          </Text>
        </View>
        <WebView
          startInLoadingState
          style={styles.webView}
          source={{ uri: this.state.checkOutUrl }}
          userAgent={userAgentAndroid}
          onNavigationStateChange={(status) =>
            this._onNavigationStateChange(status)
          }
          scalesPageToFit
        />
        <TouchableOpacity style={styles2.backButton} onPress={() => {
      //    this.comprobarOrden();
          this.checkoutModal.close();
          this.setState({ openModal: false });
        }}>
          <Text style={styles2.icon}>{'\uf053'}</Text>
          <Text style={styles2.text}>{'Regresar'}</Text>
        </TouchableOpacity>
      </Modal>
    );
  };

  comprobarOrden = () => {
    //alert("USER: "+ JSON.stringify(this.props.user.user));
    CustomAPI.GetOrdersByStatus({ userId: this.props.user.user.id, status: 'pending' }, (orders) => {
     // alert("TOTAL" + orders.length);

      if (orders.length > 1) {
        orders.forEach((order) => {
          var create = moment(order.date_created);
          var now = moment(new Date());
          var duration = moment.duration(now.diff(create));
          var minutes = duration.asMinutes();
          if (minutes < 5) {
            WooWorker.setOrderStatus(order.id, "cancelled", () => {
       
            });
          }

        });
      }


      // alert("ORDERS: " + JSON.stringify(orders))
    });


    //  data.forEach((order) => (alert(JSON.stringify(order))));

    /*  WooWorker.setOrderStatus(orderId, OrderStatus.cancelled, () => {
       
      });*/
  };

  _onClosedModal = () => {
      this.setState({ isLoading: false });
  };

  _onNavigationStateChange = (status) => {
    const { url } = status;

    if (
      url.indexOf(Config.WooCommerce.url) === 0 &&
      url.indexOf('order-received') !== -1
    ) {
      var orderId = ((status.url.match(/(order-received\/\d+)+(\/|\?|$)/) || [
        '',
      ])[0].match(/\d+/) || [''])[0];
      if (orderId) {
        this.setState({ orderId });
        save("orderId", orderId);
        save("viewSurvey", "false");

        // params = params[1].split("&");
        // params.forEach((val) => {
        //   const now = val.split("=");
        //   if (now[0] == "key" && now["1"].indexOf("wc_order") == 0) {
        //     this.setState({ orderId: now["1"].indexOf("wc_order") });
        //   }
        // });      
        this.setState({ openModal: false });
        this.checkoutModal.close();
        this.tabCartView.goToPage(3);
        this.setState({ isLoading: false });
      }
    }
    /*    else {
          alert("error que procede ");
        }*/
  };

  onShowNativeOnePageCheckOut = async (order) => {
    const params = base64.encode(encodeURIComponent(JSON.stringify(order)));
    //await this.login();
    CustomAPI.getCheckoutUrl({ order: params }, (checkOutUrl) => {

      this.setState({ checkOutUrl, openModal: true }, () => {
        this.checkoutModal.open();
      });
    });
  };

  login = async () => {
    try {
      let type = (await getValueFor("typeLogin")).toString();
      if (type) {
        if (type === 'normal') {
          let userName = (await getValueFor("userName")).toString();
          let token = (await getValueFor("token")).toString();
          const json = await WPUserAPI.login(trim(userName), token);
        }
        else if (type === 'fb') {

          const json = await WPUserAPI.ReloginFacebook(this.props.user.user.email);
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
          }
        }
      }
      else {
        console.log("aun no existe login valido ");
      }
    }
    catch (error) {
      console.log("error al intentar realizar el login: " + error);
    }

  }
  onShowCheckOut = async (order) => {
    Reactotron.log('order', order);
    const params = base64.encode(encodeURIComponent(JSON.stringify(order)));
    const checkOutUrl = `${Config.WooCommerce.url}/${Constants.WordPress.checkout}/?order=${params}`;
    await this.setState({ order, openModal: true, checkOutUrl });
    this.checkoutModal.open();
  };

  onPrevious = () => {
    if (this.state.currentIndex === 0) {
      this.props.onBack();
      return;
    }
    this.tabCartView.goToPage(this.state.currentIndex - 1);
  };

  updatePageIndex = (page) => {
    this.setState({ currentIndex: isObject(page) ? page.i : page });
  };

  onChangeTabIndex = (page) => {
    if (this.tabCartView) {
      this.tabCartView.goToPage(page);
    }
  };

  finishOrder = () => {
    const { onFinishOrder } = this.props;
    this.props.finishOrder();
    onFinishOrder();
    BlockTimer.execute(() => {
      this.tabCartView.goToPage(0);
    }, 1500);
  };

  render() {
    const { onViewProduct, navigation, cartItems, onViewHome } = this.props;
    const { currentIndex } = this.state;
    const {
      theme: {
        colors: { background },
      },
    } = this.props;

    const { openModal } = this.state;

    if (currentIndex === 0 && cartItems && cartItems.length === 0) {
      return <PaymentEmpty onViewHome={onViewHome} />;
    }
    const steps = [
      { label: Languages.MyCart, icon: Images.IconCart },
      { label: Languages.Delivery, icon: Images.IconPin },
      { label: Languages.Payment, icon: Images.IconMoney },
      { label: Languages.Order, icon: Images.IconFlag },
    ];
    return (
      <View style={[styles.fill, { backgroundColor: background }]}>
        {this.renderCheckOut()}
        <View style={styles.indicator}>
          <StepIndicator
            steps={steps}
            openModal={openModal}
            order={this.state.order}
            onChangeTab={this.onChangeTabIndex}
            currentIndex={currentIndex}
          />
        </View>
        <View style={styles.content}>
          <ScrollableTabView
            ref={(tabView) => {
              this.tabCartView = tabView;
            }}
            locked
            onChangeTab={this.updatePageIndex}
            style={{ backgroundColor: background }}
            initialPage={0}
            tabBarPosition="overlayTop"
            prerenderingSiblingsNumber={1}
            renderTabBar={() => <View style={{ padding: 0, margin: 0 }} />}
          >
            <MyCart
              key="cart"
              onNext={this.onNext}
              onPrevious={this.onPrevious}
              navigation={navigation}
              onViewProduct={onViewProduct}
            />

            <Delivery
              key="delivery"
              onNext={(formValues) => {
                this.setState({ userInfo: formValues });
                this.onNext();
              }}
              onPrevious={this.onPrevious}
              navigation={navigation}
            />
            <Payment
              key="payment"
              onPrevious={this.onPrevious}
              onNext={this.onNext}
              userInfo={this.state.userInfo}
              isLoading={this.state.isLoading}
              onShowCheckOut={this.onShowCheckOut}
              onShowNativeOnePageCheckOut={this.onShowNativeOnePageCheckOut}
            />

            <FinishOrder key="finishOrder" finishOrder={this.finishOrder} />
          </ScrollableTabView>

          {currentIndex === 0 && (
            <Buttons onPrevious={this.onPrevious} onNext={this.onNext} />
          )}
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ carts, user }) => ({
  cartItems: carts.cartItems,
  totalPrice: carts.totalPrice,
  user,
});
function mergeProps(stateProps, dispatchProps, ownProps) {
  const { dispatch } = dispatchProps;
  const CartRedux = require('@redux/CartRedux');

  return {
    ...ownProps,
    ...stateProps,
    emptyCart: () => CartRedux.actions.emptyCart(dispatch),
    finishOrder: () => CartRedux.actions.finishOrder(dispatch),
  };
}
const styles2 = StyleSheet.create({

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#f9f9f9',
    height: 50,
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
export default connect(mapStateToProps, undefined, mergeProps)(withTheme(Cart));
