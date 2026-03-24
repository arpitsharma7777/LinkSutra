import Navbar from "../components/navbar";
import Hero from "../components/Hero";
import Features from "../components/Feature";
import Steps from"../components/Steps";
import CTA from "../components/CTA"
import "../styles/Landing.css";


function Landing (){
    return(
        <>
            <Navbar/>
            <Hero/> 
            <Features/>
            <Steps/>  
            <CTA/>    
        </>
    )
}
export default Landing;