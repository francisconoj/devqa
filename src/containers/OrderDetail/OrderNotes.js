/** @format */

import React from 'react';
import { View, Text } from 'react-native';

import { Color } from '@common';
import styles from './styles';
import moment from 'moment';

export default class OrderNotes extends React.PureComponent {
  render() {
    const orderNotes = this.props.orderNotes ? this.props.orderNotes : [];
    const userNotes = orderNotes.filter((note) => note.customer_note);
    return userNotes.length ? (
      <View style={{ paddingTop: 13 }}>
        <Text style={styles.propertyName}>{'Notas del pedido'}</Text>
        <View style={{ paddingTop: 12 }}>
          {userNotes.map((item, index) => (
            <View key={index} style={styles.noteItem}>
              <Text style={styles.noteContent(Color.text)}>{item.note}</Text>
              <Text style={styles.noteTime}>
                {moment(item.date_created).fromNow()}
              </Text>
            </View>
          ))}
        </View>
      </View>
    ) : null;
  }
}
