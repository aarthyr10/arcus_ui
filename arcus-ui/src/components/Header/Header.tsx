import logo from "../../../public/Images/daikin.png"

const Header = () => {
    return (
        <>
            <div className="p-5">
                <img src={logo} alt="Daikin logo" className="h-10 w-35" />
            </div>
        </>
    )
}

export default Header