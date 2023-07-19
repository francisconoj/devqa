/** @format */

import React, { PureComponent } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Constants, Color, Languages } from "@common";
import { find, filter, get } from "lodash";
import { toast } from "@app/Omni";
class ChangeQuantityDetail extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            quantity: props.quantity,
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
            if (limit === 0) {
                toast("Agotado");
            }
            else {
                toast(Languages.ProductLimitWaring.replace("{num}", limit));
            }
        }
    };

    reduced = () => {
        if (this.state.quantity > 0) {
            this.props.onChangeQuantity(this.state.quantity - 1);
            this.setState({ quantity: this.state.quantity - 1 });
        }
    };

    render() {
        return (
            <View style={[styles.container, this.props.style]}>
                <TouchableOpacity
                    style={styles.btnDown}
                    onPress={this.reduced}>
                    <FontAwesome name="minus" size={20} color={Color.product.BuyNowButton} />
                </TouchableOpacity>
                <Text style={styles.text}>{this.state.quantity}</Text>

                <TouchableOpacity
                    style={styles.btnUp}
                    onPress={this.increase}>
                    <FontAwesome name="plus" size={20} color={Color.primary} />
                </TouchableOpacity>
            </View>
        );
    }
}
ChangeQuantityDetail.defaultProps = {
    quantity: 1,
    onChangeQuantity: () => { },
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    text: {
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        fontSize: 20,
        fontFamily: Constants.fontFamily,
        color: Color.blackTextPrimary,
        borderWidth: 1,
        borderColor: "#d4dce1",
        borderRadius: 15,
        backgroundColor: "#f7f8fa",

        tintColor: "#ccc",
        flex: 1 / 6,
    },
    btnUp: {
        flex: 1 / 4,
        justifyContent: "center",
        alignItems: "center",
    },
    btnDown: {
        flex: 1 / 4,
        justifyContent: "center",
        alignItems: "center"

    },
});

export default ChangeQuantityDetail;
