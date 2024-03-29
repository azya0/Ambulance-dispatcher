import { Outlet } from "react-router-dom";


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
            { data.map((value) => <a key={value} href={value}>{capitalize(value.slice(1))}</a>) }
        </div>
        <Outlet/>
        </>
    )
}

export default Navbar;
