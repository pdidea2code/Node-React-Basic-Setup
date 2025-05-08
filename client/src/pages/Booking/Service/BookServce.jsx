import { useOutletContext, useNavigate } from "react-router-dom";
import { getAllService } from "../../../API/Api";
import { useState, useEffect, useCallback } from "react";
import { Spinner, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import "./bookservce.css";
import { memo } from "react";
import {
  DropArrowIcon,
  AddIcon,
  RemoveIcon,
  WalletIcon,
  ClockIcon,
} from "../../../assets/icon/icons";

// const cache = new Map();

const BookServce = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { setServiceid, updateTotals, addon, setAddon, serviceid, setErrors } =
    useOutletContext();
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showService, setShowService] = useState(false);
  const [error, setError] = useState(null);
  const appSetting = useSelector((state) => state.appSetting.appSetting);

  const fetchService = useCallback(async () => {
    setLoading(true);
    try {
      // if (cache.has("services")) {
      //   console.log(cache.get("services"));
      //   setServices(cache.get("services"));
      // } else {
      const response = await getAllService();
      if (response.data.status === 200) {
        setServices(response.data.info);

        // cache.set("services", response.data.info);
      } else {
        throw new Error("Failed to fetch services");
      }
      // }
    } catch (error) {
      setError(error.message || "Error fetching services");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleServiceSelect = useCallback(
    (service) => {
      try {
        setError(null);
        setSelectedService(service);
        setServiceid(service);
        setAddon([]);
        updateTotals(service.price, service.time, []);
        setShowService(false);
      } catch (error) {
        setError("Error selecting service");
      }
    },
    [setServiceid, setAddon, updateTotals]
  );

  useEffect(() => {
    fetchService();
    if (state?.serviceid) {
      const service = {
        id: state.serviceid,
        name: state.servicename,
        price: state.serviceprice,
        time: state.servicetime,
      };
      handleServiceSelect(service);
    }
  }, []);

  useEffect(() => {
    if (serviceid.id) setSelectedService(serviceid);
  }, [serviceid]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <Spinner animation="border" style={{ color: "var(--color2)" }} />
        </div>
      ) : (
        <div>
          <div className="booking-service-title zen-dots">Select Service</div>
          <div
            className="booking-service-drop-container d-flex justify-content-between"
            onClick={() => setShowService(!showService)}
          >
            <span className="k2d zen-dots">
              {selectedService?.name || "Select Service"}
            </span>
            <div className={`drop-arrow-icon ${showService ? "active" : ""}`}>
              <DropArrowIcon className="DropArrowIcon" />
            </div>
          </div>
          <div
            className={`booking-service-dwon-container ${
              showService ? "active" : ""
            }`}
          >
            <Row>
              {services.map((item) => (
                <Col
                  lg={6}
                  md={12}
                  sm={12}
                  key={item._id}
                  onClick={() =>
                    handleServiceSelect({
                      id: item._id,
                      name: item.name,
                      price: item.price,
                      time: item.time,
                    })
                  }
                >
                  <div
                    className={`booking-service ${
                      selectedService?.id === item._id ? "active" : ""
                    }`}
                  >
                    <div className="booking-service-detail">
                      <div style={{ width: "50px", height: "50px" }}>
                        <div
                          className="booking-service-detail-icon"
                          style={{
                            WebkitMaskImage: `url("${item.iconimage}")`,
                            maskImage: `url("${item.iconimage}")`,
                          }}
                        />
                      </div>
                      <div>
                        <span
                          className="booking-service-detail-title zen-dots"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/services/${item._id}`);
                          }}
                        >
                          {item.name}
                        </span>
                        <div className="d-flex gap-3 mt-2">
                          <div className="d-flex align-items-center gap-1">
                            <WalletIcon
                              className="WalletIcon color2"
                              style={{ width: "24px", height: "24px" }}
                            />
                            <span className="booking-service-detail-title k2d">
                              {appSetting?.currency_symbol}
                              {item.price}
                            </span>
                          </div>
                          <div className="d-flex align-items-center k2d gap-1">
                            <ClockIcon
                              className="ClockIcon color2"
                              style={{ width: "22px", height: "22px" }}
                            />
                            <span className="booking-service-detail-title k2d">
                              {item.time}min
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="booking-service-add">
                      {selectedService?.id === item._id ? (
                        <RemoveIcon className="RemoveIcon" />
                      ) : (
                        <AddIcon className="AddIcon" />
                      )}
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
          {error && (
            <div className="d-flex justify-content-center align-items-center py-5">
              <span className="text-danger k2d">{error}</span>
            </div>
          )}
          <div className="booking-service-next-container">
            <button
              onClick={() => {
                if (!selectedService) {
                  setError("Please select a service");
                } else {
                  navigate("/booking/addons");
                  setErrors(null);
                }
              }}
              className="booking-service-next zen-dots btn-4"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default memo(BookServce);
