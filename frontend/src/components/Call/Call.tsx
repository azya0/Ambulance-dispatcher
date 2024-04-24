import axios from "axios";
import { useEffect, useState } from "react";


export interface Status {
    status: {
        id: number,
        name: string,
    },

    parient: {
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
    const [calls, setCalls] = useState<Status>();

    useEffect(() => {
        axios
    }, []);

    if (calls === undefined)
        return null;
    
    return (
        <>
        </>
    )
}

export default CallPage;
