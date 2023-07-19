import React from 'react'
import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Animated,
  Text
} from 'react-native'
import styles from './style'
import { Images, withTheme, Icons, Styles, Color } from '@common'
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

class Item extends React.Component {

  render() {
    let { item, onPress, selected, onRemove, onEdit } = this.props

    var address = ""
    if (item.address_1 != "") {
      address += item.address_1 + ", "
    }

    if (item.city != "") {
      address += item.city + ", "
    }

    if (item.state != "") {
      address += item.state
    }

    // if (item.country != "") {
    //   address += item.country
    // }
    /* TODO: this should be a filter in a Wordpress Plugin. */
    var phone = item.phone ? item.phone.replace("(", "").replace(") ", "").replace("-", "") : "";

    const {
      theme: {
        colors: {
          background, text
        }
      }
    } = this.props
    return (
      <TouchableOpacity style={[styles.container, { backgroundColor: background }]} activeOpacity={0.85} onPress={onPress}>
        <View style={styles.content}>
          <Text style={[styles.name, { color: text }]}>{item.name_address ? item.name_address : item.first_name + " " + item.last_name}</Text>
          {item.name_address && <Text style={[styles.text, { color: text }]}>{item.first_name + " " + item.last_name}</Text>}
          <Text style={[styles.text, { color: text }]}>{item.email}</Text>
          <Text style={[styles.text, { color: text }]}>{phone}</Text>
          {/* <Text style={[styles.text, {color: text}]}>{item.postcode}</Text> */}
          <Text style={[styles.text, { color: text }]}>{address}</Text>
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity onPress={onEdit}>
            <Icon
              style={[styles.iconEdit]}
              name={Icons.MaterialCommunityIcons.UpdateAddress}
              size={Styles.IconSize.Inline}
              color={Color.primary}
            />
          </TouchableOpacity>
          {selected && <Image source={Images.IconCheck} style={[styles.icon, { tintColor: "green" }]} />}
          {!selected && <View />}
          {!selected && (
            <TouchableOpacity onPress={onRemove}>
              <Image source={require("@images/ic_trash.png")} style={styles.icon} />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    )
  }

}

export default withTheme(Item)
