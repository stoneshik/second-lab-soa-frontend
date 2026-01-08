import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Header.scss";

export function Header() {
    const [open, setOpen] = useState(false);

    const toggleMenu = () => setOpen((v) => !v);
    const closeMenu = () => setOpen(false);

    const linkClass = ({ isActive }: { isActive: boolean }) =>
        isActive ? "header__link header__link--active" : "header__link";

    return (
        <header className="header">
            <div className="header__inner container">
                <div className="header__brand">
                    <NavLink to="/" className="header__logo" onClick={closeMenu} end>
                        Service oriented architecture
                    </NavLink>
                    <div className="header__subtitle">Стрельбицкий Илья P3413</div>
                </div>

                <button
                    className={`header__burger ${open ? "header__burger--open" : ""}`}
                    aria-expanded={open}
                    aria-label={open ? "Закрыть меню" : "Открыть меню"}
                    onClick={toggleMenu}>
                    <span className="header__burger-box">
                        <span className="header__burger-inner" />
                    </span>
                </button>

                <nav className={`header__nav ${open ? "header__nav--open" : ""}`}>
                    <NavLink to="/" className={linkClass} onClick={closeMenu} end>
                        Main
                    </NavLink>
                    <NavLink to="/flats" className={linkClass} onClick={closeMenu}>
                        Flats
                    </NavLink>
                    <NavLink to="/additional-operations" className={linkClass} onClick={closeMenu}>
                        Additional operations
                    </NavLink>
                </nav>
            </div>
        </header>
    );
}
