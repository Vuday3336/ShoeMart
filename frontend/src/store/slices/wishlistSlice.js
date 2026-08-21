import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

const initialState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchWishlist = createAsyncThunk("wishlist/fetch", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/wishlist");
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to load wishlist");
  }
});

export const addToWishlist = createAsyncThunk(
  "wishlist/add",
  async (product_id, { dispatch, rejectWithValue }) => {
    try {
      await api.post("/wishlist", { product_id });
      dispatch(fetchWishlist());
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add to wishlist");
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/remove",
  async (productId, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/wishlist/${productId}`);
      dispatch(fetchWishlist());
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to remove from wishlist");
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    resetWishlistState: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetWishlistState } = wishlistSlice.actions;
export default wishlistSlice.reducer;
