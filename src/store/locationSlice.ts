import { createSlice } from "@reduxjs/toolkit";
import { LocationCard } from "../types/locations";

interface LocationState {
    locations: LocationCard[];
}

const initialState: LocationState = {
    locations: [],
}

const locationSlice = createSlice({
    name: "location",
    initialState,
    reducers: {
        setLocations: (state, action: { payload: LocationCard[] }) => {
            state.locations = action.payload;
        },
    }
})

export const { setLocations } = locationSlice.actions;
export default locationSlice.reducer;