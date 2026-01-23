import Logo from "../logo/Logo"
import HamburgerMenu from "../menu/HamburgerMenu"


const Header = () => {
    return (
        <>
            <div className="flex justify-between p-3">
                <Logo />
                <HamburgerMenu />
            </div>
        </>
    )
}

export default Header