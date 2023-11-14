import { ReactComponent as Sun } from "./Sun.svg";
import { ReactComponent as Moon } from "./Moon.svg";
import "./DarkMode.css";

const DarkMode = () => {

    const setDarkmode = () =>{
        document.querySelector("body").setAttribute('data-theme','dark')
        localStorage.setItem("selectedTheme","dark")
    }

    const setLightmode = () =>{
        document.querySelector("body").setAttribute('data-theme','light')
        localStorage.setItem("selectedTheme","light")

    }

    // const selectedTheme = localStorage.getItem("selectedTheme")

    // if(selectedTheme === "dark") {
    //     setDarkmode();
    // }


    const toggleTheme = (e) => {
        e.target.checked ? setDarkmode() : setLightmode() ;
    }

    return (
        <div className="d-flex align-content-center justify-content-end p-3">
            <div className='dark_mode'>
                <input
                    className='dark_mode_input'
                    type='checkbox'
                    id='darkmode-toggle'
                    onChange={toggleTheme}
                    // defaultChecked={selectedTheme === "dark"}
                />
                <label className='dark_mode_label' for='darkmode-toggle'>
                    <Sun />
                    <Moon />
                </label>
            </div>
        </div>
    );
};

export default DarkMode;
