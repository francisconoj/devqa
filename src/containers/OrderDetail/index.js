/** @format */

import React from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  Modal,
  Image,
  TextInput,
} from 'react-native';
import { connect } from 'react-redux';

import { withTheme, Languages } from '@common';
import Footer from './Footer';
import ShippingAddress from './ShippingAddress';
import LineItemsAndPrice from './LineItemsAndPrice';
import OrderStatus from './OrderStatus';
import OrderNotes from './OrderNotes';
import OrderProperties from './OrderProperties';
import styles from './styles';
import { Button, Spinner } from '@components';
import { View } from 'react-native-animatable';
import { WooWorker } from "api-ecommerce";

class OrderDetail extends React.PureComponent {
  state = {
    modalVisible: false,
    isLoading: false
  };

  componentDidMount() {
    this.props.getOrderNotes(this.props.order.id);
  }
  reOrder = async () => {
    const { navigate } = this.props.navigation;
    const { cartItems } = this.props;
    // this.setModalVisible(true);
    this.setState({ isLoading: true });
    let productMissing = false;
    if (this.props.order.status === 'pending') {
      this.props.order.status = 'cancelled';
      json = await WooWorker.updateOrder({ order: this.props.order, status: "cancelled" }, this.props.order.id);

    }

    for (const o of this.props.order.line_items) {
      let json = await WooWorker.getProductId(
        o.product_id
      );
      let quantity = json.manage_stock ? json.stock_quantity : 100;

      for (var item of cartItems) {
        if ((item.quantity + o.quantity) > quantity) {
          productMissing = true;
        }
      }
      for (var i = 0; i < o.quantity; i++) {
        this.props.addCartItem(json, null);
      }
    }
    this.setState({ isLoading: false });
    if (productMissing) {
      this.setModalVisible(true);
    }
    else {
      navigate("CartScreen");
    }
  }



  MyCart = async () => {
    const { navigate } = this.props.navigation;
    this.setModalVisible(false);
    navigate("CartScreen");

  }
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  render() {
    const { order, theme, orderNotes } = this.props;
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <OrderStatus order={order} />
        <OrderProperties order={order} />
        <ShippingAddress order={order} />
        <LineItemsAndPrice order={order} />
        <OrderNotes orderNotes={orderNotes} theme={theme} />
        {order.status !== 'cancelled' &&
          order.status !== 'refunded' &&
          order.status !== 'completed' /*&& <Footer order={order} />*/}
        {(order.status === 'completed' || order.status === 'pending') &&
          <TouchableOpacity style={styles.containerButton} onPress={this.reOrder} >
            <Text style={styles.buttonText}>{order.status === 'completed' ? Languages.again : Languages.continues}</Text>
          </TouchableOpacity>

        }
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}

          onRequestClose={() => {
            this.setModalVisible(!this.state.modalVisible);
          }}
        >
          <View style={styles.centenedView2}>
            <View style={styles.modalView}>
              <View style={styles.modalView2}>

                <Image style={[styles.icon, { justifyContent: 'center' }]} source={require("@images/icono_devola.png")} />
                <Text style={[styles.survey]}>{"Hola, tienes productos en tu lista que no completan el total del pedido que necesitas.\n\nPor favor, revisa los productos indicados en tu "}<Text style={styles.innerText}>carrito.</Text></Text>

                <TouchableOpacity style={styles.btnAdd} onPress={this.MyCart} >
                  <Text style={styles.add}>{Languages.accept}</Text>
                </TouchableOpacity>

              </View>
            </View>
          </View>
        </Modal>
        {this.state.isLoading ? <Spinner mode="full" color="black" /> : null}
      </ScrollView>
    );
  }


}
const mapStateToProps = ({ carts }, ownProps) => {
  const order = carts.myOrders.find((o, i) => o.id === ownProps.id);
  return {
    carts,
    order,
    orderNotes: carts.orderNotes,
    cartItems: carts.cartItems
  };
};
function mergeProps(stateProps, dispatchProps, ownProps) {
  const { dispatch } = dispatchProps;
  const { actions } = require('@redux/CartRedux');
  return {
    ...ownProps,
    ...stateProps,
    getOrderNotes: (orderId) => {
      actions.getOrderNotes(dispatch, orderId);
    },
    addCartItem: (product, variation) => {
      actions.addCartItem(dispatch, product, variation);
    },
  };
}
export default connect(
  mapStateToProps,
  null,
  mergeProps
)(withTheme(OrderDetail));
