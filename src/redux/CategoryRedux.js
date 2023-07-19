/**
 * Created by InspireUI on 14/02/2017.
 *
 * @format
 */

import { Config } from "@common";
// import { warn } from '@app/Omni'
import { WooWorker } from "api-ecommerce";
import CustomAPI from "@services/CustomAPI";

const types = {
  FETCH_CATEGORIES_PENDING: "FETCH_CATEGORIES_PENDING",
  FETCH_CATEGORIES_SUCCESS: "FETCH_CATEGORIES_SUCCESS",
  FETCH_CATEGORIES_FAILURE: "FETCH_CATEGORIES_FAILURE",

  SWITCH_DISPLAY_MODE: "SWITCH_DISPLAY_MODE",
  SET_SELECTED_CATEGORY: "SET_SELECTED_CATEGORY",
  CATEGORY_SELECT_LAYOUT: "CATEGORY_SELECT_LAYOUT",
  FETCH_ORDER: "FETCH_ORDER",
  FETCH_VERSION: "FETCH_VERSION",
};

export const DisplayMode = {
  ListMode: "ListMode",
  GridMode: "GridMode",
  CardMode: "CardMode",
};

export const actions = {
  fetchCategories: async (dispatch) => {
    dispatch({ type: types.FETCH_CATEGORIES_PENDING });
    const json = await WooWorker.getCategories();

    if (json === undefined) {
      dispatch(actions.fetchCategoriesFailure("Can't get data from server"));
    } else if (json.code) {
      dispatch(actions.fetchCategoriesFailure(json.message));
    } else {
      dispatch(actions.fetchCategoriesSuccess(json));
    }
  },
  fetchCategoriesSuccess: (items) => {
    return { type: types.FETCH_CATEGORIES_SUCCESS, items };
  },
  fetchCategoriesFailure: (error) => {
    return { type: types.FETCH_CATEGORIES_FAILURE, error };
  },
  switchDisplayMode: (mode) => {
    return { type: types.SWITCH_DISPLAY_MODE, mode };
  },
  setSelectedCategory: (category) => {
    return { type: types.SET_SELECTED_CATEGORY, category };
  },
  setActiveLayout: (value) => {
    return { type: types.CATEGORY_SELECT_LAYOUT, value };
  },
  fetchOrder: (dispatch, orderId) => {
    dispatch({ type: types.FETCH_CATEGORIES_PENDING });
    CustomAPI.ordersById(orderId, (data) => {
      dispatch({
        type: types.FETCH_ORDER,
        data,
      });
    });
  },
  fetchVersionApp: (dispatch) => {
    dispatch({ type: types.FETCH_CATEGORIES_PENDING });
    CustomAPI.getVersionApp((version) => {
      dispatch({
        type: types.FETCH_VERSION,
        version,
      });
    });
  },

};

const initialState = {
  isFetching: false,
  error: null,
  displayMode: DisplayMode.GridMode,
  list: [],
  selectedCategory: null,
  selectedLayout: Config.CategoryListView,
};

export const reducer = (state = initialState, action) => {
  const { type, mode, error, items, category, value } = action;

  switch (type) {
    case types.FETCH_CATEGORIES_PENDING: {
      return {
        ...state,
        isFetching: true,
        error: null,
      };
    }
    case types.FETCH_CATEGORIES_SUCCESS: {
      return {
        ...state,
        isFetching: false,
        list: items || [],
        error: null,
      };
    }
    case types.FETCH_CATEGORIES_FAILURE: {
      return {
        ...state,
        isFetching: false,
        list: [],
        error,
      };
    }
    case types.SWITCH_DISPLAY_MODE: {
      return {
        ...state,
        displayMode: mode,
      };
    }
    case types.SET_SELECTED_CATEGORY: {
      return {
        ...state,
        selectedCategory: category,
      };
    }
    case types.CATEGORY_SELECT_LAYOUT:
      return {
        ...state,
        isFetching: false,
        selectedLayout: value || false,
      };
    case types.FETCH_ORDER:
      return Object.assign({}, state, {
        type: types.FETCH_MY_ORDER,
        isFetching: false,
        lastOrder: action.data,
      });
    case types.FETCH_VERSION:
      return Object.assign({}, state, {
        isFetching: false,
        versionApp: action.version,
      });

    default: {
      return state;
    }
  }
};
