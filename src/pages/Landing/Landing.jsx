import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ADMIN_PASSWORD, FACEBOOK_LINK } from "../../config/Admin";

import landingSecret from "../../assets/ui/landing-secret.png";
import landingFB from "../../assets/ui/landing-linkingfb.png";

import styles from "./Landing.module.css";

import heading from "../../assets/ui/landing-heading.png";
import enterBtn from "../../assets/ui/landing-enter.png";
import quote from "../../assets/ui/landing-quote-box.png";
import wey from "../../assets/character/landing-wey.png";
import leaves from "../../assets/effect/leaves..gif";

import LoadingScreen from "../../components/Transition/LoadingScreen";

function Landing() {

    const navigate = useNavigate();

    const [showPopup, setShowPopup] = useState(false);

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const openFacebook = () => {

        window.open(
            FACEBOOK_LINK,
            "_blank"
        );

    };

    const handleEnter = () => {

        if (loading) return;

        setLoading(true);

        setTimeout(() => {

            navigate("/home");

        }, 3200);

    };

    const confirmPassword = () => {

        if (password === ADMIN_PASSWORD) {

            setShowPopup(false);

            navigate("/admin");

        } else {

            setShowPopup(false);

            handleEnter();

        }

    };

    useEffect(() => {

        const handleKey = (e) => {

            if (e.key === "Escape") {

                setShowPopup(false);

            }

            if (e.key === "Enter" && showPopup) {

                confirmPassword();

            }

        };

        window.addEventListener(
            "keydown",
            handleKey
        );

        return () => {

            window.removeEventListener(
                "keydown",
                handleKey
            );

        };

    }, [password, showPopup]);

    return (

        <div className={styles.container}>

            <div className={styles.leafContainer}>

                <img src={leaves} className={styles.leaf1} alt="" />

                <img src={leaves} className={styles.leaf2} alt="" />

                <img src={leaves} className={styles.leaf3} alt="" />

            </div>

            <img
                src={heading}
                className={styles.heading}
                alt="Heading"
            />

            <img
                src={enterBtn}
                className={styles.enterButton}
                alt="Enter"
                onClick={handleEnter}
            />

            <img
                src={wey}
                className={styles.wey}
                alt="Wey"
            />

            <img
                src={quote}
                className={styles.quote}
                alt="Quote"
            />

            <img
                src={landingSecret}
                className={styles.secretButton}
                alt="Secret"
                onClick={() => !loading && setShowPopup(true)}
            />

            <img
                src={landingFB}
                className={styles.fbButton}
                alt="Facebook"
                onClick={openFacebook}
            />

            {showPopup && (

                <div
                    className={styles.overlay}
                    onClick={() => setShowPopup(false)}
                >

                    <div
                        className={styles.popup}
                        onClick={(e) => e.stopPropagation()}
                    >

                        <button
                            className={styles.closeButton}
                            onClick={() => setShowPopup(false)}
                        >
                            ✕
                        </button>

                        <h2>
                            🍃 Lạc đường rồi
                        </h2>

                        <p>
                            Hãy nhập tuổi bạn để tìm được đường ra nha!
                        </p>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="°❀⋆.ೃ࿔*:･°❀⋆.ೃ࿔*"
                        />

                        <button
                            className={styles.confirmButton}
                            onClick={confirmPassword}
                        >
                            Xác nhận
                        </button>

                    </div>

                </div>

            )}

            <LoadingScreen
                loading={loading}
            />

        </div>

    );

}

export default Landing;