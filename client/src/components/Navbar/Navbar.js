import "./Navbar.css";
import React from "react";
import { Link } from "react-router-dom";
import $ from "jquery";

$(function () {
  $(document).on("scroll", function () {
    var $nav = $(".navbar");
    $nav.toggleClass("scrolled", $(this).scrollTop() > $nav.height());
  });
});

const Navbar = () => {
  return (
    <>
      <nav className='navbar navbar-expand navbar-light fixed-top'>
        <Link className='navbar-brand' to='/home'>
          {"Home"}
        </Link>
      </nav>
    </>
  );
};

export default Navbar;
