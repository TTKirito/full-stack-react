import React, { FunctionComponent } from "react";
import { server } from "../../lib/api";
import { ListingData } from "./types";

const LISTINGS = `
    query Listings {
        listings {
            _id
            title
            image
            address
            price
            numOfGuests
            numOfBeds
            rating
        }
    }
`

interface Props {
    title: string;
}

export const Listings = ({ title }: Props) => {
    const fetchListings = async () => {
        const { data } = await server.fetch<ListingData>({ query: LISTINGS });
        console.log(data, 'hixxxxxxxxxxxxxxx')
    }
    return (
        <div>
            <h2>{title}</h2>
            <button onClick={fetchListings}>Query!</button>
        </div>
    )
}

// export const Listings2: FunctionComponent<Props> = ({ title }) => {
//     return <h2>{title}</h2>
// }