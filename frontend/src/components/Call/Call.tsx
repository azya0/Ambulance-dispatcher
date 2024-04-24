import axios from "axios";
import { useEffect, useState } from "react";
import config from "../../config";
import CallCard from "./CallCard";


export interface Call {
    id: number,
    status: {
        id: number,
        name: string,
    },

    patient: {
        id: number,
        address: string,
        descriptions: string,

        first_name: string,
        second_name: string,
        patronymic: string | null,
    }

    created_at: Date,
    updated_at: Date,
    end_at: Date,
}


function CallPage() {
    const [calls, setCalls] = useState<Array<Call>>();

    useEffect(() => {
        axios.get(`${config.url}/call/calls`).then(response =>
            setCalls(response.data.sort((value1: Call, value2: Call) => value1.updated_at > value2.updated_at ? 1 : -1))
        );
    }, []);

    if (calls === undefined)
        return null;
    
    return (
        <>
        <div id='call-container'>
            { calls.map(value => <CallCard key={value.id} data={value}/>) }
        </div>
        </>
    )
}

export default CallPage;
