/** @format */

import { Config } from "@common";
// import { warn } from '@app/Omni'
import { WooWorker } from "api-ecommerce";
import _ from "lodash";
import CustomAPI from "@services/CustomAPI";
import { toast } from "@app/Omni";
import { isEmpty } from "lodash";
const types = {
  ADD_ADDRESS: "ADD_ADDRESS",
  REMOVE_ADDRESS: "REMOVE_ADDRESS",
  SELECTED_ADDRESS: "SELECTED_ADDRESS",
  INIT_ADDRESSES: "INIT_ADDRESSES",
  UPDATE_SELECTED_ADDRESS: "UPDATE_SELECTED_ADDRESS",
  RESET_LIST: "RESET_LIST",
  AUTO_INIT: "AUTO_INIT",
  SET_EDIT_ADDRESS: "SET_EDIT_ADDRESS",
  UPDATE_ADDRESS: "UPDATE_ADDRESS"
};

export const actions = {
  addAddress: (dispatch, address) => {
    dispatch({ type: types.ADD_ADDRESS, address });
  },

  removeAddress: (dispatch, index) => {
    dispatch({ type: types.REMOVE_ADDRESS, index });
  },

  selectAddress: (dispatch, address, userId) => {
    dispatch({ type: types.SELECTED_ADDRESS, address, userId });
  },
  initAddresses: (dispatch, customerInfo) => {
    dispatch({ type: types.RESET_LIST, address: null });
    CustomAPI.getAddresses({ user_id: customerInfo.id }, (addresses) => {
      if (addresses.addresses) {
        for (let address of addresses.addresses) {
          dispatch({ type: types.AUTO_INIT, address });
          if (address.selected === "true") {
            dispatch({ type: types.SELECTED_ADDRESS, address });
          }
        }
      }
      else {
        const address1 = {
          email: customerInfo.email,
          first_name: customerInfo.first_name,
          last_name: customerInfo.last_name,
          address_1: customerInfo.billing ? customerInfo.billing.address_1 : "",
          state: customerInfo.billing ? customerInfo.billing.state : "Guatemala",
          postcode: customerInfo.billing ? customerInfo.billing.postcode : "01001",
          country: customerInfo.billing ? customerInfo.billing.country : "",
          phone: customerInfo.billing ? customerInfo.billing.phone : "",
          city: customerInfo.billing ? customerInfo.billing.city : "Guatemala",
          note: "",
          user: customerInfo.id,
          selected: "true"
        };
        const listAdd = [address1];
        CustomAPI.setAddresses({ user_id: customerInfo.id, address: listAdd }, (addresses) => {
        });

        dispatch({ type: types.AUTO_INIT, address: address1 });
        dispatch({ type: types.SELECTED_ADDRESS, address: address1 });
      }

    });
  },
  updateSelectedAddress: (dispatch, address) => {
    dispatch({ type: types.UPDATE_SELECTED_ADDRESS, address });
  },
  setEditAddress: (dispatch, idAddress) => {
    dispatch({ type: types.SET_EDIT_ADDRESS, idAddress });
  },
  updateAddress: (dispatch, address, index) => {
    dispatch({ type: types.UPDATE_ADDRESS, address, index });
  },
};

const initialState = {
  list: [],
  reload: false,
  editAddress: [],
};

export const reducer = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case types.AUTO_INIT: {
      state.list.push(action.address);
      return {
        ...state,
        reload: !state.reload,
      };
    }

    case types.ADD_ADDRESS: {
      const address1 = {
        name_address: action.address.name_address,
        email: action.address.email,
        first_name: action.address.first_name,
        last_name: action.address.last_name,
        address_1: action.address.address_1,
        state: action.address.state,
        postcode: action.address.postcode,
        country: action.address.country,
        phone: action.address.phone,
        city: action.address.city,
        note: action.address.note,
        user: action.address.user,
        selected: "false"
      };
      state.list.push(address1);
      state.selectedAddress = address1;
      CustomAPI.setAddresses({ user_id: address1.user, address: state.list }, (addresses) => {
      });
      return {
        ...state,
        reload: !state.reload,
      };
    }
    case types.REMOVE_ADDRESS: {
      state.list.splice(action.index, 1);
      return {
        ...state,
        reload: !state.reload,
      };
    }
    case types.SELECTED_ADDRESS: {
      CustomAPI.setAddresses({ user_id: action.userId, address: state.list }, (addresses) => {
      });
      return {
        ...state,
        reload: !state.reload,
        selectedAddress: action.address,
      };
    }
    case types.INIT_ADDRESSES: {
      return {
        ...state,
        reload: !state.reload,
        selectedAddress: action.address,
        list: [action.address],
      };
    }
    case types.UPDATE_SELECTED_ADDRESS: {
      const list = state.list || [];
      let index = -1;
      list.forEach((item, i) => {
        if (_.isEqual(item, state.selectedAddress)) {
          index = i;
        }
      });
      if (index > -1) {
        list.splice(index, 1);
      }
      list.push(action.address);
      return {
        ...state,
        reload: !state.reload,
        list,
        selectedAddress: action.address,
      };
    }
    case types.RESET_LIST: {
      state.list = [];
    }
    case types.SET_EDIT_ADDRESS: {
      return {
        ...state,
        editAddress: action.idAddress
      };
    }
    case types.UPDATE_ADDRESS: {

      const address1 = {
        name_address: action.address.name_address,
        email: action.address.email,
        first_name: action.address.first_name,
        last_name: action.address.last_name,
        address_1: action.address.address_1,
        state: action.address.state,
        postcode: action.address.postcode,
        country: action.address.country,
        phone: action.address.phone,
        city: action.address.city,
        note: action.address.note,
        user: action.address.user,
        selected: action.address.selected
      };
      state.list[action.index] = address1;
      state.selectedAddress = address1;

      CustomAPI.setAddresses({ user_id: address1.user, address: state.list }, (addresses) => {
      });
      return {
        ...state,
        reload: !state.reload,
      };
    }
    default: {
      return state;
    }
  }
};
