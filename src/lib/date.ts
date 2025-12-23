import {format} from "date-fns"

const date = (_date : string) =>{
    return format(_date,"dd-MMM-yyyy");
}


export {date};