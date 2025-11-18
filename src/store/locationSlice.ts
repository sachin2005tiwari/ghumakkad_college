import { createSlice } from "@reduxjs/toolkit";
import { LocationCard } from "../types/locations";

// interface में loading state को जोड़ना
interface LocationState {
    locations: LocationCard[];
    loading: boolean; 
}

const initialState: LocationState = {
    locations: [],
    loading: false, 
}

const locationSlice = createSlice({
    name: "location",
    initialState,
    reducers: {
        setLocations: (state, action: { payload: LocationCard[] }) => {
            state.locations = action.payload;
            
            state.loading = false;
        },
        
        setLoading: (state, action: { payload: boolean }) => {
            state.loading = action.payload;
        },
    }
})

// actions को export करें
export const { setLocations, setLoading } = locationSlice.actions;
export default locationSlice.reducer;