
import { useParams } from "react-router-dom"
import Profile from "../components/Profile";

export default function ProfilePage({type}){

    const {userId} = useParams()
    
    
    return(<Profile profileContent={type} userId={userId} key={userId}/>)
}