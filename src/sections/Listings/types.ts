interface Listing {
  _id: string;
  title: string;
  image: string;
  address: string;
  price: string;
  numOfGuests: number;
  numOfBeds: number;
  numOfBaths: number;
  rating: number;
}

export interface ListingData {
  listings: Listing[];
}

export interface DeleteListingData {
  _id: Listing;
}

export interface DeleteListingVariables {
  id: string;
}
