/**
 * Created by InspireUI on 17/02/2017.
 *
 * @format
 */

import React, { PureComponent } from "react";
import { TouchableOpacity, Text, StyleSheet, View, Image } from "react-native";
import { Color } from "@common";
import { Icon } from "@app/Omni";

class Button extends PureComponent {
  // constructor(props) {
  //   super(props)
  // }

  render() {
    const {
      text,
      icon,
      onPress,
      button,
      containerStyle,
      textStyle,
      containerColor,
      textColor,
      iconColor,
      imageIcon
    } = this.props;
    return (
      <TouchableOpacity
        style={[
          styles.container,
          button,
          { backgroundColor: containerColor },
          containerStyle,
        ]}
        onPress={onPress}>
        {icon ? (
          <Icon name={icon} color={iconColor ? iconColor : textColor} size={24} style={styles.icon} />
        ) : (
          <View />
        )}
        <View >
        {imageIcon ? (

          //<Icon name={icon} color={iconColor ? iconColor : textColor} size={24} style={styles.icon} />
          <Image source={imageIcon} style={styles.image}/>
        ) : (
          <View />
        )}
        </View>
        <View style={imageIcon ? styles.textContainer: styles.textWithoutImageContainer}>
          <Text style={[styles.text, { color: textColor }, textStyle]}>
            {text}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    minHeight: 44,
    maxHeight: 44,
    padding: 10,
    flexDirection: "row",
    
  },
  text: {
    fontWeight: "bold",
    
    //width:"100%",
  },
  icon: {
    marginRight: 10,
  },
  image:{
    height: 25,
    width: 25,
    //marginRight: 10
    
  },
  imageContainer:{ 
    justifyContent: "flex-start",
    //alignItems: "start",
    marginRight: 10,
    //left: 10,
    marginLeft: 10,
   
  },
  textContainer:{ 
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    marginLeft: "auto",
    marginRight: "auto",

   
  },
  textWithoutImageContainer:{
   /* marginLeft: "auto",
    marginRight: "auto",
    width: "100%"*/
  }
});

Button.defaultProps = {
  text: "Button",
  onPress: () => "Button pressed!",
  containerStyle: {},
  textStyle: {},
  containerColor: Color.theme2,
  textColor: "white",
};

export default Button;
