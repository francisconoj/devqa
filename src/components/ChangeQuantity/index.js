/** @format */

import React, { PureComponent } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Constants, Color, Languages } from "@common";
import { find, filter, get } from "lodash";
import { toast } from "@app/Omni";
class ChangeQuantity extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      quantity: props.quantity,
      limite: get(props.product, "manage_stock") ? get(props.product, "stock_quantity") : Constants.LimitAddToCart
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.quantity !== "undefined") {
      this.setState({ quantity: nextProps.quantity });
    }
  }

  increase = () => {
    const { quantity } = this.props;
    const { product } = this.props;

    const limit = get(product, "manage_stock")
      ? get(product, "stock_quantity")
      : Constants.LimitAddToCart;

    if (this.state.quantity < limit) {
      let newQuantity = this.state.quantity + 1;
      // newQuantity = newQuantity > quantity ? quantity : newQuantity;
      this.props.onChangeQuantity(newQuantity);
      this.setState({ quantity: newQuantity });
    }
    else {
      toast(Languages.ProductLimitWaring.replace("{num}", limit));

    }
  };

  reduced = () => {
    if (this.state.quantity > 1) {
      this.props.onChangeQuantity(this.state.quantity - 1);
      this.setState({ quantity: this.state.quantity - 1 });
    }
  };

  render() {
    const hitSlop = { top: 20, right: 10, bottom: 20, left: 10 };

    const limit = get(this.props.product, "manage_stock")
      ? get(this.props.product, "stock_quantity")
      : Constants.LimitAddToCart;
    return (
      <View style={[styles.container, this.props.style]}>
        <TouchableOpacity
          style={styles.btnUp}
          hitSlop={hitSlop}
          onPress={this.increase}>
          <FontAwesome name="sort-up" size={20} color="#b7c4cb" />
        </TouchableOpacity>
        {
          this.state.quantity <= limit &&
          <Text style={styles.text}>{this.state.quantity}</Text>
        }
        {
          this.state.quantity > limit &&
          <Text style={[styles.text, { color: Color.error }]}>{this.state.quantity}</Text>
        }


        <TouchableOpacity
          style={styles.btnDown}
          hitSlop={hitSlop}
          onPress={this.reduced}>
          <FontAwesome name="sort-down" size={20} color="#b7c4cb" />
        </TouchableOpacity>
      </View>
    );
  }
}
ChangeQuantity.defaultProps = {
  quantity: 1,
  onChangeQuantity: () => { },
};

const styles = StyleSheet.create({
  container: {
    width: 42,
    backgroundColor: "#f7f8fa",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d4dce1",
    borderRadius: 15,
  },
  text: {
    fontSize: 17,
    fontFamily: Constants.fontFamily,
    color: Color.blackTextPrimary,
  },
  btnUp: {
    height: 42,
    justifyContent: "center",
    alignItems: "center",
  },
  btnDown: {
    height: 42,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChangeQuantity;
