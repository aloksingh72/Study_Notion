import React from "react";
import { Link, matchPath } from "react-router-dom";
import logo from "../../assets/Logo/Logo-Full-Light.png";
import { NavbarLinks } from "../../data/navbar-links";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai";
import ProfileDropDown from "../core/Auth/ProfileDropDown";
import { apiConnector } from "../../services/apiconnector";
import { categories } from "../../services/apis";
import { useState } from "react";
import { useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { ACCOUNT_TYPE } from "../../utils/constants";
import { ImCross } from "react-icons/im";

const Navbar = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const location = useLocation();
  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isClose, setIsClose] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      // console.log(" yaha tak data pauch raha hai");
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API);
        console.log("response", res);
        setSubLinks(res.data.data);
      } catch (error) {
        console.log("Could not fetch Categories.", error);
      }
      setLoading(false);
    })();
  }, []);
  console.log("sub links", subLinks);

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };
  const handleCrossButton = () => {
    isClose = isClose ? setIsClose(false) : setIsClose(true);
    // smallScreen = smallScreen ? setSmallScreen(false) : setSmallScreen(true);
  };

  return (
    <div
      className={`flex h-14 items-center justify-center border-b-[1px]
    border-b-richblack-700
     ${location.pathname !== "/" ? "bg-richblack-800" : ""}
     ${
       location.pathname === "/"
         ? "fixed w-screen z-[1000]  bg-richblack-900"
         : ""
     }
      ${
        location.pathname === "/about"
          ? "fixed w-screen z-[1000]  bg-richblack-700"
          : ""
      }  
      ${
        location.pathname === "/contact" ||
        matchRoute("/catalog/:catalogName") ||
        matchRoute("/courses/:courseId")
          ? "fixed w-screen z-[1000]  bg-richblack-800"
          : ""
      }
       transition-all duration-200 `}
    >
      <div
        className={`flex fixed ${
          location.pathname !== "/" ? "bg-richblack-800" : "bg-richblack-900"
        } z-40 lg:relative  w-[100%] h-[8%] border-b-[1px] lg:border-none border-b-richblack-500  lg:w-11/12 
        max-w-maxContent items-center justify-between`}
      >
        <Link to="/">
          <img src={logo} alt=" " width={160} height={32} loading="lazy" />
        </Link>

        {/* Navigation links */}
        <nav className="hidden md:block">
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => {
              return (
                <li key={index}>
                  {link.title === "Catalog" ? (
                    <div
                      className={`group relative flex cursor-pointer items-center gap-1 ${
                        matchRoute("/catalog/:catalogName")
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      <p>{link.title}</p>
                      <IoIosArrowDown />
                      <div
                        className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] 
                       translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4
                       text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible 
                       group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]"
                      >
                        <div
                          className="absolute left-[50%] top-0 -z-10 translate-x-[80%] 
                          translate-y-[-40%] h-6 w-6 select-none rotate-45 rounded bg-richblack-5"
                        ></div>

                        {subLinks.map((subLink, index) => (
                          <Link
                            to={`/catalog/${subLink.name
                              .split(" ")
                              .join("-")
                              .toLowerCase()}`}
                            className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                            key={index}
                          >
                            <p>{subLink.name}</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link to={link?.path}>
                      <p
                        className={`${
                          matchRoute(link?.path)
                            ? "text-yellow-50"
                            : "text-richblack-25"
                        }`}
                      >
                        {link.title}
                      </p>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
        {/* login /signup/Dashboard */}
        <div className="hidden items-center gap-x-4 md:flex">
          {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link
              to="/dashboard/cart"
              className="relative flex flex-row 
      justify-center items-center gap-3"
            >
              <AiOutlineShoppingCart
                color="white"
                className=" hover:scale-110 text-2xl text-richblack-100 "
              />
              {totalItems > 0 && (
                <span
                  className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center
                   overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100"
                >
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {token === null && (
            <Link to="/login">
              <button
                className="border text-richblack-25 font-semibold text-sm
               bg-richblack-800 rounded-md w-fit
                px-5 py-1 hover:scale-105 hover:bg-richblack-700"
              >
                Login
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button
                className=" border text-richblack-25 font-semibold text-sm
               bg-richblack-800 rounded-md w-fit
                px-5 py-1 hover:scale-105 hover:bg-richblack-700"
              >
                Signup
              </button>
            </Link>
          )}
          {token !== null && <ProfileDropDown />}
        </div>
        {isClose === false ? (
          <button className="mr-4 md:hidden" onClick={handleCrossButton}>
            <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
          </button>
        ) : (
          <button className="mr-4 md:hidden" onClick={handleCrossButton}>
            <ImCross fontSize={24} fill="#AFB2BF" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
