/** @format */

import { Config } from "@common";
// import { warn } from '@app/Omni'
import _ from "lodash";
import CustomAPI from "@services/CustomAPI";

const types = {
    INIT_PROMOTIONS: "INIT_PROMOTIONS",

};

export const actions = {

    initPromotions: (dispatch ) => {
        CustomAPI.GetAllPromotions((promotions) => {
            if (promotions) {
            //    alert(JSON.stringify(promotions.product_pricing));
                   dispatch({ type: types.INIT_PROMOTIONS, promotions });
            }
        });
    },
};

const initialState = {
    list: [],
    reload: false,
};

export const reducer = (state = initialState, action) => {
    const { type } = action;

    switch (type) {
        case types.INIT_PROMOTIONS: {
            state.list = action.promotions.product_pricing;
            
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
