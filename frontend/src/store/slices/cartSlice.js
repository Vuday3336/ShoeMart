import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

const initialState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchCart = createAsyncThunk("cart/fetch", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/cart");
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to load cart");
  }
});

export const addToCart = createAsyncThunk(
  "cart/add",
  async ({ product_id, quantity = 1, size = "9" }, { dispatch, rejectWithValue }) => {
    try {
      await api.post("/cart", { product_id, quantity, size });
      dispatch(fetchCart());
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add to cart");
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/update",
  async ({ cartItemId, quantity }, { dispatch, rejectWithValue }) => {
    try {
      await api.put(`/cart/${cartItemId}`, { quantity });
      dispatch(fetchCart());
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update cart item");
    }
  }
);

export const removeCartItem = createAsyncThunk(
  "cart/remove",
  async (cartItemId, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/cart/${cartItemId}`);
      dispatch(fetchCart());
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to remove cart item");
    }
  }
);

export const clearCart = createAsyncThunk("cart/clear", async (_, { rejectWithValue }) => {
  try {
    await api.delete("/cart");
    return true;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to clear cart");
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCartState: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export const { resetCartState } = cartSlice.actions;

// Derived selectors
export const selectCartCount = (state) => state.cart.items.reduce((sum, i) => sum + i.quantity, 0);
export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);

export default cartSlice.reducer;
