'use client';
import { createSlice } from "@reduxjs/toolkit"
const initialState = {
    userDetail: false,
    userArr: []
}
export const bazar = createSlice({
    name: 'Bazar',
    initialState,
    reducers: {
        setUserDetail: (state, action) => {
            state.userDetail = action.payload
        },
        setUserArr: (state, action) => {
            state.userArr = action.payload
        }
            // addItems: (state, action) => {
            // state.cartData.push(action.payload)
            // },            
            // changeItemsQuantity: (state, action) => {
            //     state.ItemsQuantity[action.payload?.index1][action.payload?.index2] += action.payload.quantity
            // },
            // setItemsQuantity: (state, action) => {
            //     state.ItemsQuantity = action.payload
            // },
            // setCartOpen: (state, action) => {
            //     state.cartOpen = action.payload
            // },
            // setCartData: (state, action) => {
            //     state.cartData = action.payload
            // }
    }
    }
)
// const bazarReducer = bazar.reducer
export const { setUserDetail, setUserArr } = bazar.actions
export default bazar.reducer;