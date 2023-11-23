'use client';
import { createSlice } from "@reduxjs/toolkit"
const initialState = {
    userDetail: 'loading',
    userArr: [],
    unSub: false,
    check: false
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
        },
        setUnSub: (state, action) => {
            state.unSub = action.payload
        },
        setCheck: (state, action) => {
            state.check = action.payload
        }
    }
    }
)
export const { setUserDetail, setUserArr, setUnSub, setCheck } = bazar.actions
export default bazar.reducer;