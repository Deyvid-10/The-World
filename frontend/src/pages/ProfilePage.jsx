
import { useParams } from "react-router-dom"
import Profile from "../components/Profile";

export default function ProfilePage({type}){

    const {userId} = useParams()
    console.log(userId);
    console.log(type);
    
    
    return(<Profile profileContent={type} userId={userId}/>)
}