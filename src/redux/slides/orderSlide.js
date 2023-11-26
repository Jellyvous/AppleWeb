import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    orderItems: [],

    shippingAddress: {},
    shippingMethod
        : "",
    itemsPrice: 0,
    shippingPrice: 0,

    totalPrice: 0,
    phone: "",
    isSuccessOrder: false,
};

export const orderSlide = createSlice({
    name: "order",
    initialState,
    reducers: {
        addOrderProduct: (state, action) => {
            const { orderItem } = action.payload;
            const itemOrder = state?.orderItems?.find(
                (item) => item?.product === orderItem.product
            );
            if (itemOrder) {
                if (itemOrder.amount <= itemOrder.countInStock) {
                    itemOrder.amount += orderItem?.amount;
                    state.isSuccessOrder = true;
                    state.isErrorOrder = false;
                }
            } else {
                state.orderItems.push(orderItem);
            }
        },
        resetOrder: (state) => {
            state.isSuccessOrder = false;
        },
        increaseAmount: (state, action) => {
            const { idProduct } = action.payload;
            const itemOrder = state?.orderItems?.find(
                (item) => item?.product === idProduct
            );
            const itemOrderSelected = state?.orderItemsSelected?.find(
                (item) => item?.product === idProduct
            );
            itemOrder.amount++;
            if (itemOrderSelected) {
                itemOrderSelected.amount++;
            }
        },
        decreaseAmount: (state, action) => {
            const { idProduct } = action.payload;
            const itemOrder = state?.orderItems?.find(
                (item) => item?.product === idProduct
            );
            const itemOrderSelected = state?.orderItemsSelected?.find(
                (item) => item?.product === idProduct
            );
            itemOrder.amount--;
            if (itemOrderSelected) {
                itemOrderSelected.amount--;
            }
        },
        removeOrderProduct: (state, action) => {
            const { idProduct } = action.payload;

            const itemOrder = state?.orderItems?.filter(
                (item) => item?.product !== idProduct
            );
            const itemOrderSelected = state?.orderItemsSelected?.filter(
                (item) => item?.product !== idProduct
            );

            state.orderItems = itemOrder;
            state.orderItemsSelected = itemOrderSelected;
        },
    },
});

// Action creators are generated for each case reducer function
export const {
    addOrderProduct,
    increaseAmount,
    decreaseAmount,
    removeOrderProduct,
    resetOrder,
} = orderSlide.actions;

export default orderSlide.reducer;
