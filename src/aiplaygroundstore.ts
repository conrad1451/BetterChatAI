import { configureStore, createSlice } from "@reduxjs/toolkit";

// Redux setup
const globalAIVarsSlice = createSlice({
  name: "globalNumVar",
  initialState: { globalNumVar: 0, globalStrVar: "" },
  reducers: {
    updateGlobalNumVar: (state, action) => {
      state.globalNumVar = action.payload;
    },
    updateGlobalStrVar: (state, action) => {
      state.globalStrVar = action.payload;
    },
  },
});

const aiplaygroundstore = configureStore({
  reducer: {
    globalNumVar: globalAIVarsSlice.reducer,
  },
});

export const { updateGlobalNumVar, updateGlobalStrVar } =
  globalAIVarsSlice.actions;
export { aiplaygroundstore };
