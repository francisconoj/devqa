/** @format */

import React, { PureComponent } from "react";
import { FlatList } from "react-native";
import _ from "lodash";
import { connect } from "react-redux";
import { AddressItem } from "@components";
import { withTheme } from "@common";
import CustomAPI from "@services/CustomAPI";
import { toast, BlockTimer } from "@app/Omni";

class Address extends PureComponent {
  render() {
    const { list, reload, selectedAddress } = this.props;
    const {
      theme: {
        colors: { background, text },
      },
    } = this.props;

    return (
      <FlatList
        overScrollMode="never"
        style={{ backgroundColor: background }}
        extraData={this.props}
        keyExtractor={(item, index) => `${index}`}
        data={list}
        renderItem={({ item, index }) => (
          <AddressItem
            onPress={() => this.selectAddress(item)}
            selected={_.isEqual(item, selectedAddress)}
            item={item}
            onRemove={() => this.removeAddress(index)}
            onEdit={() => this.editAddress(index)}
          />
        )}
      />
    );
  }

  removeAddress = (index) => {
    const item = this.props.list[index];
    this.props.removeAddress(index);
    CustomAPI.setAddresses({ user_id: this.props.list[0].user, address: this.props.list }, (addresses) => {


    });
  };
  
  selectAddress = (item) => {
    this.props.list.forEach(element => {
      if (element === item) {
        element.selected = "true";
      }
      else {
        element.selected = "false";
      }

    });
    this.props.selectAddress(item, this.props.user.user.id);
  };

  editAddress = (index) => {
    const { setSelectedAddress, onEditAddress} = this.props;
    let modAddress=this.props.list[index];
    modAddress["index"] = index;
    BlockTimer.execute(() => {
      setSelectedAddress({ idAddress : modAddress });
      onEditAddress({ address: index });
    }, 500);
  };

}

Address.defaultProps = {
  list: [],
  selectedAddress: {},
};

const mapStateToProps = (state) => {
  return {
    list: state.addresses.list,
    reload: state.addresses.reload,
    selectedAddress: state.addresses.selectedAddress,
    user : state.user
  };
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  const { dispatch } = dispatchProps;
  const { actions } = require("@redux/AddressRedux");
  return {
    ...ownProps,
    ...stateProps,
    removeAddress: (index) => {
      actions.removeAddress(dispatch, index);
    },
    selectAddress: (address, userId) => {
      actions.selectAddress(dispatch, address, userId);
    },
    setSelectedAddress:(idAddress) => {
      actions.setEditAddress(dispatch, idAddress);
    },
  };
}

export default connect(
  mapStateToProps,
  undefined,
  mergeProps
)(withTheme(Address));
