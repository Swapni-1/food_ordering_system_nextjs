import axios from "axios";


async function handleAddCart(email : string,foodId : string){
    const {data : cart} = await axios.get("/api/cart/"+email)


    const cartData = cart.filter((item) => item.food_id === foodId);

    if(cartData.length > 0){
        return true
    }else{
        axios.post(`/api/cart/${email}`,{foodId})
        .then(({data}) => {
            console.log(data);
            return false;
        })
        .catch(error => console.log(error))
    }
}

export {handleAddCart}