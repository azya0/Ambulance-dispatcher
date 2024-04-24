import { Call } from "./Call";

interface Prop {
    data: Call,
}


function CallCard({ data }: Prop) {
    return (
    <>
    <div className="call-card">
        <div className="call-status">{ data.status.name }</div>
        <div className="patient">
            Пациент:
            <b>{ data.patient.second_name }</b>
            <b>{ data.patient.first_name }</b>
            <b>{ data.patient.patronymic }</b>
        </div>
        <div className="info">
            Адрес:
            <b>{ data.patient.address }</b>
            Описание:
            <b>{ data.patient.descriptions }</b>
            Обслуживается:
            <b>{ "Нет" }</b>
        </div>
    </div>
    </>
    )
}

export default CallCard;