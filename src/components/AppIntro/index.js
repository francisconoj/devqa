/** @format */

import React, { PureComponent } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { View, Text, I18nManager, Image } from "react-native";
import { LinearGradient } from "@expo";
import AppIntroSlider from "react-native-app-intro-slider";
import { connect } from "react-redux";
import { Images, Config } from "@common";
import styles from "./styles";

class AppIntro extends PureComponent {
  _renderItem = (props) => {
    const { item } = props;

    return (
      <LinearGradient
        style={[
          styles.mainContent,
          {
            paddingTop: props.topSpacer,
            paddingBottom: props.bottomSpacer,
            width: props.width,
            height: props.height,
          },
        ]}
        colors={item.colors}
        start={{ x: 0, y: 0.1 }}
        end={{ x: 0.1, y: 1 }}>
        <View style={{
          flex: 1, backgroundColor: "white", width: "90%", alignItems: "center", borderRadius: 50,
          justifyContent: "flex-start", marginBottom: 70, marginTop: 50
        }}>
          {item.key === "page1" ?
            (<Image style={{
              backgroundColor: "transparent",
              width: "100%", height: "60%",
              resizeMode: "contain",
              alignItems: "center",
              justifyContent: "center"
            }} source={item.image} />) : (<Image style={{
              backgroundColor: "transparent",
              width: "85%", height: "40%",
              resizeMode: "contain",
              alignItems: "center",
              marginTop: "20%",
              justifyContent: "center"
            }} source={item.image} />)}

          <View>

            <Text style={item.key === "page1" ? styles.title : styles.title2}>{item.title}</Text>
            <Text style={item.key === "page1" ? styles.text: styles.text2}>{item.text}</Text>
          </View>
        </View>
      </LinearGradient>
    );
  };

  _renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Ionicons
          name={
            I18nManager.isRTL ? "md-arrow-round-back" : "md-arrow-round-forward"
          }
          color="rgba(255, 255, 255, .9)"
          size={24}
          style={{ backgroundColor: "transparent" }}
        />
      </View>
    );
  };

  _renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Ionicons
          name="md-checkmark"
          color="rgba(255, 255, 255, .9)"
          size={24}
          style={{ backgroundColor: "transparent" }}
        />
      </View>
    );
  };

  render() {
    return (
      <AppIntroSlider
        data={Config.intro}
        renderItem={this._renderItem}
        renderDoneButton={this._renderDoneButton}
        renderNextButton={this._renderNextButton}
        onDone={this.props.finishIntro}
      />
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  const { actions } = require("@redux/UserRedux");
  return {
    finishIntro: () => dispatch(actions.finishIntro()),
  };
};
export default connect(
  null,
  mapDispatchToProps
)(AppIntro);
