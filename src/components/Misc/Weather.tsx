import { useState, useEffect, FunctionComponent } from "react";
import axios from "axios";
import { useDarkMode } from "../../hooks/useDarkMode";
import { ApiError } from "../../interfaces/ApiError";
import { errorMessage } from "../../services/feedbackService";
import { WeatherData } from "../../interfaces/WeatherData";

const fetchWeatherData = async (
  city: string,
  apiKey: string,
  baseUrl: string
) => {
  try {
    const response = await axios.get(
      `${baseUrl}weather?q=${city}&appid=${apiKey}&units=metric`
    );
    if (response.status !== 200) {
      throw response;
    }
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    } else if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

const Weather: FunctionComponent<object> = () => {
  const apiKey: string = import.meta.env.VITE_WEATHER_KEY,
    baseUrl: string = import.meta.env.VITE_WEATHER_URL;

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null),
    [city, setCity] = useState("Tel Aviv"),
    [error, setError] = useState<string | null>(null),
    [isRefreshing, setIsRefreshing] = useState(false),
    isDarkMode = useDarkMode();

  useEffect(() => {
    const getCurrentLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude,
              lon = position.coords.longitude;
            try {
              const response = await axios.get(
                  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
                ),
                data = response.data,
                city =
                  data.address.city ||
                  data.address.town ||
                  data.address.village;
              if (city) {
                setCity(city);
              }
            } catch (error) {
              console.error("Error getting city from geolocation:", error);
              errorMessage("Error getting city from geolocation");
            }
          },
          (error) => {
            errorMessage(error.message);
          },
          {
            timeout: 10000, // 10 seconds
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser");
      }
    };
    getCurrentLocation();
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const data = await fetchWeatherData(city, apiKey, baseUrl);
        setWeatherData(data);
        setError(null);
      } catch (err: Error | unknown) {
        if (err && typeof err === "object" && "response" in err) {
          if ((err as ApiError).response.status === 401) {
            setError("Invalid or expired token");
          } else {
            setError((err as ApiError).response.data as string);
          }
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };
    fetchWeather();
  }, [city, apiKey, baseUrl]);

  useEffect(() => {
    const intervalId = setInterval(handleRefresh, 180000); // refresh every 3 minutes
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city, apiKey, baseUrl]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const data = await fetchWeatherData(city, apiKey, baseUrl);
      setWeatherData(data);
      setError(null);
    } catch (err: Error | unknown) {
      if (err && typeof err === "object" && "response" in err) {
        if ((err as ApiError).response.status === 401) {
          setError("Invalid or expired token");
        } else {
          setError((err as ApiError).response.data as string);
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="weather-con d-flex align-items-center">
      {weatherData && (
        <>
          <img
            src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
            alt="Weather Icon"
          />
          <span>
            {city}: {weatherData.main.temp.toFixed(1)}°C,{" "}
            {weatherData.weather[0].main}
          </span>
        </>
      )}
      {error && <span style={{ color: "red" }}>{error}</span>}
      <button
        className={`btn btn-sm ${
          isDarkMode ? "btn-light" : "btn-dark"
        } rounded-circle m-2`}
        onClick={handleRefresh}
        disabled={isRefreshing}>
        {isRefreshing ? (
          <i className="fa-solid fa-spinner fa-spin"></i>
        ) : (
          <i className="fa-solid fa-rotate-right"></i>
        )}
      </button>
    </div>
  );
};

export default Weather;
