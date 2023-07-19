/**
 * Created by InspireUI on 06/03/2017.
 *
 * @format
 */

import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, TouchableOpacity, Animated, Image } from "react-native";
import ChangeQuantityProduct from "@components/ChangeQuantityProduct";
import { Styles, Color, withTheme, Tools, Images, Constants, Languages } from "@common";
import { getProductImage, toast } from "@app/Omni";
import { Rating, ImageCache, Text } from "@components";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DisplayMode } from "@redux/CategoryRedux";
import styles from "./styles";
import { connect } from "react-redux";
import { takeWhile, filter, get } from "lodash";

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

class ProductRow extends PureComponent {
  animatedValue = new Animated.Value(0);
  constructor(props) {
    super(props);
    this.state = {
      isInWishList: false,
      selectVariation: null,
      selectedImageId: 0, // is placeholder image
      selectedImage: null,
      attributeOption: null,
      quantity: 1,
      inCartTotal: 0,
      valueCard: 0
    };
    this.timer = 5000;
  }

  componentDidMount() {
    this.getPromotionByProductRol();

    const { product, wishListItems } = this.props;
    const isInWishList =
      wishListItems.find((item) => item.product.id == product.id) != undefined;
    this.setState({ isInWishList });

    this.getCartTotal(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.getCartTotal(this.props);
    this.forceUpdate();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.getCartTotal(nextProps, true);

    // this important to update the variations from the product as the Life cycle is not run again !!!
    if (this.props.product !== nextProps.product) {
      this.props.getProductVariations(nextProps.product);
      this.getProductAttribute(nextProps.product);
      this.forceUpdate();
    }

    if (this.props.productVariations !== nextProps.productVariations) {
      this.updateSelectedVariant(nextProps.productVariations);
    }
  }
  getProductAttribute = (product) => {
    this.productAttributes = product.attributes;
    const defaultAttribute = product.default_attributes;

    if (typeof this.productAttributes !== "undefined") {
      this.productAttributes.map((attribute) => {
        const selectedAttribute = defaultAttribute.find(
          (item) => item.name === attribute.name
        );
        attribute.selectedOption =
          typeof selectedAttribute !== "undefined"
            ? selectedAttribute.option.toLowerCase()
            : "";
      });
    }
  };

  getCartTotal = (props, check = false) => {
    const { cartItems } = props;
    let total = false;
    for (let Item of cartItems) {
      if (Item.product.id === this.props.product.id) {
        total = true;
        this.setState({ inCartTotal: Item.quantity });
      }
    }
    if (!total) {
      this.setState({ inCartTotal: 0 });
    }
  };

  updateSelectedVariant = (productVariations) => {
    let hasAttribute = false;
    const defaultVariant =
      productVariations && productVariations.length
        ? productVariations[0]
        : null;
    // filter selectedOption null or don't have variation
    const selectedAttribute = filter(
      this.productAttributes,
      (item) =>
        (item.selectedOption && item.selectedOption !== "") || item.variation
    );
    let selectedImage =
      (defaultVariant && (defaultVariant.image && defaultVariant.image.src)) ||
      "";
    let selectedImageId = 0;

    if (productVariations && productVariations.length) {
      productVariations.map((variant) => {
        let matchCount = 0;
        selectedAttribute.map((selectAttribute) => {
          const isMatch = find(
            variant.attributes,
            (item) =>
              item.name.toUpperCase() === selectAttribute.name.toUpperCase() &&
              item.option.toUpperCase() ===
              selectAttribute.selectedOption.toUpperCase()
          );
          if (isMatch !== undefined) {
            matchCount += 1;
          }
        });

        if (matchCount === selectedAttribute.length) {
          hasAttribute = true;
          selectedImage = (variant.image && variant.image.src) || "";
          selectedImageId = variant.image.id;
          this.setState({
            selectVariation: variant,
            selectedImage,
            selectedImageId,
          });
        }
      });
    }

    // set default variant
    if (!hasAttribute && defaultVariant) {
      this.setState({
        selectVariation: defaultVariant,
        selectedImage,
        selectedImageId,
      });
    }

    this.forceUpdate();
  };

  flipCard(animatedValue, value) {
    if (value >= 90) {
      this.setState({ valueCard: 0 });
      Animated.spring(animatedValue, {
        toValue: 0,
        friction: 8,
        tension: 10
      }).start();
    } else {
      this.setState({ valueCard: 180 });
      Animated.spring(animatedValue, {
        toValue: 180,
        friction: 8,
        tension: 10
      }).start();
      sleep(this.timer).then(r => {
        this.flipCard(animatedValue, 180);
      })
    }
  }
  onChangeQuantity = (quantity) => {
    const { removeCartItem, product, onViewCart } = this.props;
    const { selectVariation } = this.state;

    if (this.state.inCartTotal < quantity) {
      this.addToCart();

    }
    else {
      this.props.removeCartItem(this.props.product, this.state.selectVariation, this.getPromotionByProduct());
    }
    //this.setState({ quantity });
    //this.state.quantity = quantity;
  };

  reload = () => {
    sleep(this.timer).then(r => {
      this.flipCard(this.animatedValue, 180);
    })

  };


  addToCart = (go = false) => {
    const { addCartItem, product } = this.props;
    const { selectVariation } = this.state;
    const limit = get(product, "manage_stock")
      ? get(product, "stock_quantity")
      : Constants.LimitAddToCart;

    if (this.state.inCartTotal < limit) {
      addCartItem(product, selectVariation, this.getPromotionByProduct());

      toast(Languages.AddedtoCart);
    } else {
      toast(Languages.ProductLimitWaring.replace("{num}", limit));
    }
    // if (go) onViewCart();
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


  getPromotionByProductRol = () => {
    let totalPromotion = 0;
    let hasUserPromotion = false;
    //discount__amount
    //discount__percentage
    if(this.props.userData){
    this.props.promotions.list.map((promotion) => {
      if (promotion.method === 'simple' && promotion.exclusivity === 'all') {
        promotion.conditions.map((condition) => {
          if ("customer__role" === condition.type) {
            condition.roles.map((rol) => {
              if (this.props.userData.role == rol) {
                hasUserPromotion = true;
             //   alert(JSON.stringify(this.props.product.categories));
                //  this.props.product.price = 1;
                //  alert("rol con descuento");
              }
            });
          }
          if ("product__category" === condition.type && hasUserPromotion) {
            condition.product_categories.map((category) => {
              this.props.product.categories.map((categoryProduct) => {
                if(categoryProduct.id == category){
                  if(promotion.pricing_method === 'discount__percentage'){
                    this.props.product.price = this.props.product.price - (this.props.product.price*(promotion.pricing_value/100)) ;
                   // alert(promotion.pricing_value);
                  }
                  else if (promotion.pricing_method === 'discount__amount'){
                    this.props.product.price = this.props.product.price - promotion.pricing_value;
                  }
                }
               });
            });
          }
        });
      }
    });
  }
    return totalPromotion;
  }


  render() {
    const { product, onPress, displayMode } = this.props;
    const { isInWishList } = this.state;
    const {
      theme: {
        colors: { background, text },
        dark: isDark,
      },
      currency,
    } = this.props;

    const isListMode =
      displayMode === DisplayMode.ListMode ||
      displayMode === DisplayMode.CardMode;
    const isCardMode = displayMode === DisplayMode.CardMode;

    const textStyle = isListMode ? styles.text_list : styles.text_grid;
    const imageStyle = isListMode ? styles.image_list : styles.image_grid;
    const image_width = isListMode
      ? Styles.width * 0.9 - 2
      : Styles.width * 0.45 - 2;

    const productPrice = `${Tools.getPriceIncluedTaxAmount(
      product,
      null,
      false,
      currency
    )} `;
    const regular_price =
      product["multi-currency-prices"] &&
        product["multi-currency-prices"][currency.code]
        ? product["multi-currency-prices"][currency.code]["price"]
        : product.regular_price;
    const productPriceSale = product.on_sale
      ? `${Tools.getCurrecyFormatted(regular_price, currency)} `
      : null;
    const image =
      product.images && product.images.length
        ? product.images[0].src
        : Images.PlaceHolderURL;


    //this.animatedValue = new Animated.Value(0);

    this.animatedValue.addListener(({ value }) => {
      this.setState({ valueCard: value });
    });
    let frontInterpolate = this.animatedValue.interpolate({
      inputRange: [0, 180],
      outputRange: ['0deg', '180deg'],
    })
    let backInterpolate = this.animatedValue.interpolate({
      inputRange: [0, 180],
      outputRange: ['180deg', '360deg']
    })
    let frontOpacity = this.animatedValue.interpolate({
      inputRange: [89, 90],
      outputRange: [1, 0]
    })
    let backOpacity = this.animatedValue.interpolate({
      inputRange: [89, 90],
      outputRange: [0, 1]
    })

    const frontAnimatedStyle = {
      transform: [
        { rotateY: frontInterpolate }
      ]
    }
    const backAnimatedStyle = {
      transform: [
        { rotateY: backInterpolate }
      ]
    }
    this.getCartTotal(this.props);

    const hitSlop = { top: 20, right: 10, bottom: 20, left: 10 };
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => this.flipCard(this.animatedValue, this.state.valueCard)}
      >
        <View>
          <Animated.View style={[styles.container_product,
          isListMode ? styles.container_list : styles.container_grid,
          { backgroundColor: background }, frontAnimatedStyle, { opacity: frontOpacity }]}>
            <ImageCache
              uri={getProductImage(image, image_width)}
              style={[styles.image, imageStyle]}
            />
            <View style={{ paddingHorizontal: 10 }}>
              <Text
                numberOfLines={2}
                style={[textStyle, isCardMode && styles.cardText]}>
                {product.name}
              </Text>
              <View
                style={{
                  flexDirection: isCardMode ? "column" : "row",
                  justifyContent:
                    displayMode === DisplayMode.ListMode
                      ? "space-between"
                      : "center",
                  alignItems: isCardMode ? "center" : "flex-start",
                  paddingTop: 6,
                }}>
                <View
                  style={[styles.price_wrapper, !isListMode && { marginTop: 0 }]}>
                  <Text
                    style={[
                      textStyle,
                      styles.price,
                      isCardMode && styles.cardPrice,
                      // !isListMode && { color: Color.blackTextSecondary },
                      isDark && { color: "rgba(255,255,255,0.8)" },
                    ]}>
                    {productPrice}
                  </Text>
                  <Text
                    style={[
                      textStyle,
                      styles.sale_price,
                      isCardMode && styles.cardPriceSale,
                      isDark && { color: "rgba(255,255,255,0.6)" },
                    ]}>
                    {productPriceSale}
                  </Text>
                </View>
                {isListMode && (
                  <View style={styles.price_wrapper}>
                    <Rating
                      rating={Number(product.average_rating)}
                      size={
                        (isListMode
                          ? Styles.FontSize.medium
                          : Styles.FontSize.small) + 5
                      }
                    />
                    <Text style={[textStyle, styles.textRating, { color: text }]}>
                      {`(${product.rating_count})`}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </Animated.View>
          {this.state.valueCard >= 90 && <Animated.View style={[styles.container_product,
          isListMode ? styles.container_list : styles.container_grid,
          { backgroundColor: background }, styles.flipCardBack, backAnimatedStyle, { opacity: backOpacity }]}>
            <View style={{ paddingHorizontal: 10, justifyContent: "center", alignItems: "center" }}>
              <TouchableOpacity onPress={onPress}>
                <Image source={require("@images/info.png")} style={styles.icon} resizeMode={"cover"} />
              </TouchableOpacity>
              <Text
                numberOfLines={2}
                style={[styles.textBackFlip]}>
                {product.name}
              </Text>
              <ChangeQuantityProduct
                style={styles.quantity2}
                quantity={this.state.inCartTotal}
                product={product}
                onChangeQuantity={this.onChangeQuantity}
                reload={this.reload}
              />
            </View>

          </Animated.View>}
        </View>

      </TouchableOpacity>
    );
  }
}

ProductRow.propTypes = {
  product: PropTypes.object.isRequired,
  onPress: PropTypes.func,
  displayMode: PropTypes.string,
  product: PropTypes.any,
  getProductVariations: PropTypes.func,
  productVariations: PropTypes.any,
  onViewCart: PropTypes.func,
  addCartItem: PropTypes.func,
  removeWishListItem: PropTypes.func,
  addWishListItem: PropTypes.func,
  cartItems: PropTypes.any,
  navigation: PropTypes.object,
};

const mapStateToProps = (state) => {
  return {
    cartItems: state.carts.cartItems,
    wishListItems: state.wishList.wishListItems,
    productVariations: state.products.productVariations,
    userData: state.user.user,
    currency: state.currency,
    promotions: state.promotions
  };
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  const { dispatch } = dispatchProps;
  const CartRedux = require("@redux/CartRedux");
  const ProductRedux = require("@redux/ProductRedux");
  return {
    ...ownProps,
    ...stateProps,
    addCartItem: (product, variation, promotion) => {
      CartRedux.actions.addCartItem(dispatch, product, variation, promotion);
    },
    removeCartItem: (product, variation, promotion) => {
      CartRedux.actions.removeCartItem(dispatch, product, variation, promotion);
    },
    getProductVariations: (product) => {
      ProductRedux.actions.getProductVariations(dispatch, product);
    },
  };
}
export default connect(
  mapStateToProps,
  undefined,
  mergeProps
)(withTheme(ProductRow));
