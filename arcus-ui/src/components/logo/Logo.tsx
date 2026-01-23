import logo from "../../../public/Images/daikin.png"

const Logo = () => {
    return (
        <>
            <div className="fixed p-5">
                <img src={logo} alt="Daikin logo" className="h-10 w-35" />
            </div>
        </>
    )
}

export default Logo;