import {createSlice} from '@reduxjs/toolkit';

export const category_slice = createSlice({
    name: 'category',
    initialState: {
        value: "",
    },
    reducers: {
        setCategoryValue: (state, action) => {
            state.value = action.payload;
        }
    }
})

export const {setCategoryValue} = category_slice.actions;

export const selectCategory = (state) => state.category.value