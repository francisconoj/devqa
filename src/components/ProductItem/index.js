/** @format */

import React, { PureComponent } from "react";
import { TouchableOpacity, Text, View, Image, Dimensions } from "react-native";

import ChangeQuantity from "@components/ChangeQuantity";
import { connect } from "react-redux";
import { withTheme, Tools, Constants } from "@common";
import styles from "./styles";
import { get } from "lodash";
class ProductItem extends PureComponent {
  onChangeQuantity = (quantity) => {
    //   alert("Hola")
    if (this.props.quantity < quantity) {
      this.props.addCartItem(this.props.product, this.props.variation, this.getPromotionByProduct());
    } else {
      this.props.removeCartItem(this.props.product, this.props.variation, this.getPromotionByProduct());
    }
  };
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

  deleteAllElements = () => {
    for (var i = 0; i < this.props.quantity; i++) {
      this.props.removeCartItem(this.props.product, this.props.variation, this.getPromotionByProduct());
    }


  };

  render() {
    const {
      product,
      quantity,
      viewQuantity,
      variation,
      onPress,
      onRemove,
    } = this.props;
    const {
      theme: {
        colors: { background, text, lineColor },
        dark: isDark,
      },
      currency
    } = this.props;
    const limit = get(this.props.product, "manage_stock")
      ? get(this.props.product, "stock_quantity")
      : Constants.LimitAddToCart;
    product.problem = 0;
    if (quantity > limit) {
      product.problem = 1;
    }
    else {
      product.problem = 0;
    }

    return (
      <View
        style={[
          styles.container,
          { backgroundColor: background },
          isDark && { borderBottomColor: lineColor },
        ]}>
        <View style={styles.content}>
          <TouchableOpacity onPress={() => onPress({ product })}>
            <Image
              source={{ uri: Tools.getImageVariation(product, variation) }}
              style={styles.image}
            />
          </TouchableOpacity>

          <View
            style={[
              styles.infoView,
              { width: Dimensions.get("window").width - 180 },
            ]}>
            <TouchableOpacity onPress={() => onPress({ product })}>
              {quantity > limit &&
                <Text style={[{ color: 'red', fontFamily: 'FuturaBold', fontSize: 12, }]}>
                  {product.name}
                </Text>
              }
              {quantity <= limit &&
                <Text style={[styles.title, { color: text }]}>
                  {product.name}
                </Text>}

            </TouchableOpacity>
            <View style={styles.priceContainer}>
              <Text style={[styles.price, { color: text }]}>
                {Tools.getPriceIncluedTaxAmount(product, variation, false, currency)}
              </Text>

              {variation &&
                typeof variation.attributes !== "undefined" &&
                variation.attributes.map((variant) => {
                  return (
                    <Text
                      key={variant.name}
                      style={styles.productVariant(text)}>
                      {variant.option}
                    </Text>
                  );
                })}
            </View>

            {quantity > limit && limit > 0 &&
              <View>
                <Text style={[{ color: '#767676', fontFamily: 'Futura', fontSize: 12, }]}>
                  {"Cantidad disponible: " + limit}
                </Text>
              </View>
            }
            {quantity > limit && limit === 0 &&
              <View>
                <Text style={[{ color: 'red', fontFamily: 'Futura', fontSize: 12, }]}>
                  {"Producto agotado"}
                </Text>
              </View>
            }

          </View>
          {viewQuantity && (
            <ChangeQuantity
              style={styles.quantity}
              quantity={quantity}
              product={product}
              onChangeQuantity={this.onChangeQuantity}
            />
          )}
        </View>

        {viewQuantity && (
          <TouchableOpacity
            style={styles.btnTrash}
            onPress={() => this.deleteAllElements()}>
            <Image
              source={require("@images/ic_trash.png")}
              style={[styles.icon, { tintColor: text }]}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    promotions: state.promotions
  };
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  const { dispatch } = dispatchProps;
  const { actions } = require("@redux/CartRedux");
  return {
    ...ownProps,
    ...stateProps,
    addCartItem: (product, variation, promotion) => {
      actions.addCartItem(dispatch, product, variation, promotion);
    },
    removeCartItem: (product, variation, promotion) => {
      actions.removeCartItem(dispatch, product, variation, promotion);
    },
  };
}

export default connect(
  mapStateToProps,
  undefined,
  mergeProps
)(withTheme(ProductItem));
