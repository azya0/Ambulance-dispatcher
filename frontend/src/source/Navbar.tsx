import React from 'react';

interface Prop {
    data: string[]
}

function Navbar({ data }: Prop) {
    const capitalize = (value: string) => {
        return value.slice(0, 1).toUpperCase() + value.slice(1);
    };

    return (
        <>
        <div id='navbar'>
            { data.map((value) => <a href={value}>{capitalize(value.slice(1))}</a>) }
        </div>
        </>
    )
}

export default Navbar;