import { LocationCard, LocationDetails } from "../types/locations";
import { supabase } from "./supabaseClient";

export class LocationService{
    async getLocations() : Promise<LocationCard[] | any>{
        try{
            const columns = "id, name, landing_image, about_description";
            const {data , error} = await supabase.from('locations').select(columns);
            if(error){
                throw error;
            }
            if(data){
                return data as LocationCard[];
            }
        } catch (error) {
            console.error("Error fetching locations:", error);
            throw error;
        }
    }

    async searchLocationByName(name: string) : Promise<LocationCard[] | any>{
        try{
            const columns = "id, name, landing_image, about_description";
            const {data , error} = await supabase.from('locations').select(columns).ilike('name', `%${name}%`);
            if(error){
                throw error;
            }
            if(data){
                return data as LocationCard[];
            }
        } catch (error) {
            console.error("Error searching locations by name:", error);
            throw error;
        }
    }

    async getLocationById(id: number) : Promise<LocationDetails[] | any>{
        try{
            const {data, error} =  await supabase.from('locations').select('*').eq('id', id).single();
            if(error){
                throw error;
            }
            if(data){
                return data as LocationDetails[];
            }
        } catch (error) {
            console.error("Error fetching location by ID:", error);
            throw error;
        }
    }
}

const locationService = new LocationService();
export default locationService;