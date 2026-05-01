import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { courseId: null, couponCode: '', discountAmount: 0 },
  reducers: {
    setCartCourse: (state, action) => { state.courseId = action.payload; },
    setCoupon: (state, action) => { state.couponCode = action.payload.code; state.discountAmount = action.payload.discountAmount; },
    clearCart: (state) => { state.courseId = null; state.couponCode = ''; state.discountAmount = 0; },
  },
});

export const { setCartCourse, setCoupon, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
