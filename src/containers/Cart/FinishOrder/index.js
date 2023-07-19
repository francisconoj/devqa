/** @format */

import React, { PureComponent } from "react";
import { Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Button } from "@components";
import { Languages, Color, withTheme, Config } from "@common";
import styles from "./styles";
import moment from "moment";
class FinishOrder extends PureComponent {
  render() {
    const {
      theme: {
        colors: { background, text },
      },
    } = this.props;

    var date = new Date();
    date.setDate(date.getDate() + 1);
    return (
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="ios-checkmark-circle"
            size={80}
            color={Color.secondary}
          />
        </View>

        <Text style={[styles.title, { color: text }]}>
          {Languages.ThankYou}
        </Text>
        <Text style={[styles.message, { color: text }]}>
          {Languages.FinishOrder.replace('{date}', moment(date).format('DD/MM/YYYY'))}
        </Text>

        {!Config.Login.AnonymousCheckout && (
          <View style={styles.btnNextContainer}>
            <Button
              text={Languages.ViewMyOrders}
              style={styles.button}
              textStyle={styles.buttonText}
              onPress={this.props.finishOrder}
            />
          </View>
        )}
      </View>
    );
  }
}

export default withTheme(FinishOrder);
