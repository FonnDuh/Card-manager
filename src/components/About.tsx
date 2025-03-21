import { FunctionComponent } from "react";
import { useDarkMode } from "../hooks/useDarkMode";
import { useNavigate } from "react-router-dom";

const About: FunctionComponent<object> = () => {
  const { isDarkMode } = useDarkMode(),
    navigate = useNavigate();

  return (
    <div
      className={`container my-5 w-50 position-relative ${
        isDarkMode ? "bg-dark text-white" : "bg-light text-dark"
      }`}>
      <button
        className="back-button position-absolute d-flex align-items-center justify-content-center"
        onClick={() => navigate(-1)}
        aria-label="Go Back">
        <svg height="28" width="28" viewBox="0 0 1024 1024">
          <path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path>
        </svg>
        <span>Go Back</span>
      </button>
      <h1 className="display-4 text-center mb-4">About Us</h1>
      <div className="mb-5">
        <p className="lead">
          Welcome to BCard, your ultimate solution for creating, browsing, and
          managing business cards with ease. Our innovative platform is designed
          to cater to professionals and businesses of all sizes, offering a
          seamless and efficient way to handle all your business card needs.
        </p>
      </div>
      <h2 className="display-5 text-center mb-4">Our Mission</h2>
      <div className="mb-5">
        <p className="lead">
          At BCard, we strive to simplify the way you network and manage your
          professional connections. Our mission is to provide a user-friendly,
          powerful tool that helps you create stunning business cards,
          efficiently manage your contacts, and enhance your professional
          presence.
        </p>
      </div>
      <h2 className="display-5 text-center mb-4">What We Offer</h2>
      <div className="mb-5">
        <h3 className="h4 mb-3 text-center">Create</h3>
        <p className="lead">
          Design unique and professional business cards effortlessly with our
          intuitive creation tools. Choose from a variety of templates,
          customize every detail, and ensure your business card stands out.
        </p>
      </div>
      <div className="mb-5">
        <h3 className="h4 mb-3 text-center">Browse</h3>
        <p className="lead">
          Explore a wide range of business cards within our app. Find
          inspiration, discover new contacts, and connect with professionals
          from various industries.
        </p>
      </div>
      <div className="mb-5">
        <h3 className="h4 mb-3 text-center">CRM for Admins</h3>
        <p className="lead">
          Our comprehensive CRM features enable admins to manage business card
          data, users data, and maintain valuable business relationships. Stay
          on top of your networking game with advanced analytics and reporting
          tools.
        </p>
      </div>
      <h2 className="display-5 text-center mb-4">Contact Us</h2>
      <div className="mb-5 d-flex flex-column align-items-center">
        <p className="lead">
          <strong>Email: </strong>
          <a href="mailto:BCard@email.com">BCard@email.com</a>
        </p>
        <p className="lead">
          <strong>Phone: </strong>123-456-7890
        </p>
        <p className="lead">
          <strong>Address: </strong>
          <a
            href="https://www.google.ca/maps/place/Caldeira+do+Cabe%C3%A7o+Gordo/@38.5719693,-28.674628,14.5z/data=!4m9!1m2!2m1!1s1234+BCard+St,+BCard+City,+BCard+Country!3m5!1s0xb380a45141fb72d:0xfa91e2e40472bae8!8m2!3d38.5804155!4d-28.706323!16s%2Fg%2F11cspl2wmb?entry=ttu"
            target="_blank"
            rel="noopener noreferrer"
            className={isDarkMode ? "text-white" : "text-dark"}>
            1234 BCard St, BCard City, BCard Country
          </a>
        </p>
      </div>
      <div
        className={`my-5 shadow-lg rounded border ${
          isDarkMode ? "bg-dark text-white" : "bg-light text-dark"
        }`}>
        <iframe
          className="w-100 rounded border"
          height="450"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen={false}
          loading="lazy"
          src="https://www.google.com/maps/embed/v1/place?key=AIzaSyC242UmMcZfebIs-R4GbXK2SoAC12Z-lXM&q=BCard St 1234+BCard City+BCard Country"></iframe>
      </div>
    </div>
  );
};

export default About;
