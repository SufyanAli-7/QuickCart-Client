import React from "react";
import logo from "@/assets/logo.svg";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <div className="flex flex-col md:flex-row items-start justify-center px-6 md:px-16 lg:px-32 gap-10 py-14 border-b border-gray-500/30 text-gray-500">
        <div className="w-4/5">
          <img className="w-28 md:w-32" src={logo} alt="logo" />
          <p className="mt-6 text-sm">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
        </div>

        <div className="w-1/2 flex items-center justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Company</h2>
            <ul className="text-sm space-y-2">
              <li>
                <Link className="hover:underline transition" to="/">Home</Link>
              </li>
              <li>
                <Link className="hover:underline transition" to="/products">Products</Link>
              </li>
              <li>
                <Link className="hover:underline transition" to="#">About us</Link>
              </li>
              <li>
                <Link className="hover:underline transition" to="#">Contact us</Link>
              </li>
              <li>
                <Link className="hover:underline transition" to="#">Privacy policy</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-1/2 flex items-start justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Get in touch</h2>
            <div className="text-sm space-y-2">
              <p>+92-301-7135273</p>
              <p>sufyan.ali0612@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
      <p className="py-4 text-center text-xs md:text-sm">
        Copyright {new Date().getFullYear()} &copy; Sufyan Ali.  All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;