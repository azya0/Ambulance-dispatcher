interface Prop {
    first_name: string,
    second_name: string,
    patronymic: string,
    post: string,
    is_ill: boolean,
}


function PersonalString({ first_name, second_name, patronymic, post, is_ill }: Prop) {
    function SetIll() {
        console.log('test');
    }

    return (
        <>
        <tr className="personal-string">
            <td>{ second_name }</td>
            <td>{ first_name }</td>
            <td>{ patronymic }</td>
            <td>{ post }</td>
            <td className={ (is_ill ? "color-red" : "color-green") }>
                <b className="ill" onClick={SetIll}>{ is_ill ? "Болеет" : "Здоров" }</b>
            </td>
        </tr>
        </>
    )
}

export default PersonalString;
