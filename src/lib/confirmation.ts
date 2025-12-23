import axios from "axios";

async function confirmationDetail(email : string){
    const {data : orderData} = await axios.get("/api/order/"+email);

    if(orderData.length > 0){
        const confirmData = orderData[orderData.length - 1];
        return confirmData;
    }
}

export {confirmationDetail};