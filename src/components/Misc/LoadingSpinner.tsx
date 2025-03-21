import { FunctionComponent } from "react";
import "../../styles/Misc/LoadingSpinner.css"

const LoadingSpinner: FunctionComponent<object> = () => {
  return (
    <div className="spinner-container">
      <div className="spinner">
        <div className="wavy-dots-spinner">
          <div className="dot dot-1"></div>
          <div className="dot dot-2"></div>
          <div className="dot dot-3"></div>
          <div className="dot dot-4"></div>
          <div className="dot dot-5"></div>
          <div className="dot dot-6"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
