import React from 'react'
import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Animated,
  Text,
  Clipboard
} from 'react-native'
import styles from './style'
import { Images, withTheme, Icons, Styles, Color } from '@common'
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { toast, BlockTimer } from "@app/Omni";
import moment from 'moment';
import { WooWorker } from "api-ecommerce";
import { connect } from "react-redux";
import {
  Spinner
} from "@components";
class NotificationItem extends React.Component {

  state = {
    isLoading: false,


  };
  copyToClipboard = () => {
    const cupon = this.props.item.coupon;
    Clipboard.setString(cupon);
    toast("Se ha copiado al portapapeles el cupon: " + cupon);
  }
  onPress = async () => {
    if (this.props.item.type !== null && this.props.item.type !== '') {
      switch (this.props.item.type) {
        case 'producto':
          this.setState({ isLoading: true });
          const json = await WooWorker.productsByName(this.props.item.product, 1, 1);
     
          this.onRowClickProductHandle(json[0]);
          break;
        case 'categoria':
          this.setState({ isLoading: true });
          this.onRowClickCategoryHandle();
          break;
      }
    }


  };

  onRowClickProductHandle = (product) => {
    BlockTimer.execute(() => {
      this.setState({ isLoading: false });
      this.props.onViewProductScreen({ product });
    }, 10);

  }
  onRowClickCategoryHandle = async () => {
    const { setSelectedCategory } = this.props;
    const categories = await WooWorker.getCategories();
    let category;
    categories.forEach(element => {
      if (element.name.toUpperCase().trim() === this.props.item.category.toUpperCase().trim()) {
        category = element;
      }
    });

    this.setState({ isLoading: false });
    BlockTimer.execute(() => {
      setSelectedCategory({
        ...category,
        mainCategory: category,
      });
      this.props.onViewCategoryScreen({ mainCategory: category });
    }, 10);
  }

  render() {
    let { item, onPress } = this.props


    let cupon = item.type !== null && item.type === 'cupon' ? item.coupon : '';
    var dt = item.post_date;
    return (
      <TouchableOpacity style={[styles.container, { backgroundColor: 'white' }]} activeOpacity={0.85} onPress={this.onPress}>
        <View style={styles.content1}>
          <Text style={[styles.text, { paddingLeft: 10 }]}>{moment(dt).format('DD/MM/YYYY')}</Text>
          <Text style={[styles.text, { alignItems: "flex-end", justifyContent: "flex-end", textAlign: 'right', paddingRight: 10 }]}>{moment(dt).format('HH:mm')}</Text>

        </View>
        <View style={styles.content}>
          <Text style={[styles.name, { color: "#1877F2", textAlign: 'center', paddingTop: 15 }]}>{item.post_title}</Text>
          <Text style={[styles.text2, { textAlign: 'center', paddingTop: 15 }]}>{item.post_content}</Text>


        </View>
        {
          cupon !== '' &&
          <View style={styles.buttons}>
            <TouchableOpacity onPress={this.copyToClipboard}>
              <Icon
                style={[styles.iconEdit]}
                name={Icons.MaterialCommunityIcons.copy}
                size={Styles.IconSize.Inline}
                color={Color.primary}
              />
            </TouchableOpacity>
          </View>
        }
        {this.state.isLoading ? <Spinner mode="full" color="black" /> : null}

      </TouchableOpacity>
    )
  }

}
const mapStateToProps = ({ products, news }, ownProps) => {
  const list =
    ownProps.type === undefined ? products.productSticky : news.sticky;
  return { list };
};
const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { dispatch } = dispatchProps;
  const Product = require("@redux/ProductRedux");
  const { actions } = require("@redux/CategoryRedux");
  return {
    ...ownProps,
    ...stateProps,
    fetchStickyProducts: (per_page, page) => {
      Product.actions.fetchStickyProducts(dispatch, per_page, page);
    },
    setSelectedCategory: (category) =>
      dispatch(actions.setSelectedCategory(category)),
  };
};
export default connect(
  mapStateToProps,
  null,
  mergeProps
)(NotificationItem);
