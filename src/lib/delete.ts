import axios from "axios"
import { Bounce, toast } from "react-toastify";


function deleteUserById(userId : string,mutate : any,close : any){
    axios.delete("/api/user/"+userId)
    .then(({data}) => {
        console.log(data);
        mutate();
        toast.success(`user deleted successfully`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
            });
    })
    .catch(error => console.log(error))
    .finally(() => close())
}

function deleteCategoryById(categoryId : string,mutate : any,close : any){
    axios.delete("/api/category/"+categoryId)
    .then(({data}) => {
        console.log(data);
        mutate();
        toast.success(`category deleted successfully`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
            });
    })
    .catch(error => console.log(error))
    .finally(() => close());
}

function deleteFoodById(foodId : string ,mutate : any ,close : any){
    axios.delete("/api/food/"+foodId)
    .then(({data}) => {
        console.log(data);
        mutate();
        toast.success(`food deleted successfully`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
            });
    })
    .catch(error => console.log(error))
    .finally(() => close())
}

export { deleteCategoryById, deleteFoodById, deleteUserById }