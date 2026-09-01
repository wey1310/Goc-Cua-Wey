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


import preloadAssets from "../../utils/preloadAssets";
import {

    getCharacters

} from "../../services/characterService";

// ===== Home Assets =====

const homeBg = "/assets/background/home-bg.webp";

import homeHeading from "../../assets/ui/home-heading.png";

import homeMusic from "../../assets/ui/home-music.png";

import homeBack from "../../assets/ui/home-back.png";

import homeBoardCounter from "../../assets/ui/home-board-counter.png";

import searchBox from "../../assets/ui/search-box.png";

import tagTemplate from "../../assets/ui/tag-template.png";

import randomBoard from "../../assets/ui/randombroad.png";

import randomBtn from "../../assets/ui/random.png";

import rankingBoard from "../../assets/ui/rankingbroad.png";

import top1 from "../../assets/ui/top1.png";

import top2 from "../../assets/ui/top2.png";

import top3 from "../../assets/ui/top3.png";

import teaLeaf from "../../assets/ui/tea-leaf-card.png";

import frame01 from "../../assets/effect/wey/frame01.png";

import randomGif from "../../assets/effect/wey/random.gif";

import randomLeaf from "../../assets/effect/random-leaf.webp";

import bgMusic from "../../assets/music/garden.mp3";

import randomSound from "../../assets/music/randomsound.mp3";

import gardenMusic from "../assets/music/garden.mp3";
import choHoaKhoHeoMusic from "../assets/music/Đợi Hoa Khô Héo Rồi Mới Tưới Nước - Cửa Hàng Tiện Lợi Nhĩ Đóa.mp3";
import muaLaPhaoHoaMusic from "../assets/music/Mưa Là Pháo Hoa Của Thần Linh - Nyxx.mp3";
import nhoDenPhatDienMusic from "../assets/music/Nhớ nhưng đến phát điên - Cửa hàng tiện lợi Nhĩ Đóa.mp3";
import chuaBaoGioMusic from "../assets/music/Chưa Bao Giờ - Chi Pu.mp3";
import gimmeDatLoveMusic from "../assets/music/Gimme Dat Love - i-dle.mp3";
import mashupDouyinMusic from "../assets/music/Mashup HIT Tiktok Trung Douyin 2020.mp3";
import sakuraMusic from "../assets/music/Sakura - Ikimonogakari.mp3";

export const DEFAULT_MUSIC_TRACKS = [
    {
        id: "music-01",
        title: "Đợi Hoa Khô Héo Rồi Mới Tưới Nước",
        artist: "Cửa Hàng Tiện Lợi Nhĩ Đóa",
        url: choHoaKhoHeoMusic,
        fileName: "Đợi Hoa Khô Héo Rồi Mới Tưới Nước - Cửa Hàng Tiện Lợi Nhĩ Đóa.mp3",
        description: "",
        active: true,
        order: 1,
        duration: "03:16",
        playCount: 0
    },

    {
        id: "music-02",
        title: "Mưa Là Pháo Hoa Của Thần Linh",
        artist: "Nyxx",
        url: muaLaPhaoHoaMusic,
        fileName: "Mưa Là Pháo Hoa Của Thần Linh - Nyxx.mp3",
        description: "",
        active: true,
        order: 2,
        duration: "03:17",
        playCount: 0
    },

    {
        id: "music-03",
        title: "Nhớ nhưng đến phát điên",
        artist: "Cửa hàng tiện lợi Nhĩ Đóa",
        url: nhoDenPhatDienMusic,
        fileName: "Nhớ nhưng đến phát điên - Cửa hàng tiện lợi Nhĩ Đóa.mp3",
        description: "",
        active: true,
        order: 3,
        duration: "02:37",
        playCount: 0
    },

    {
        id: "music-04",
        title: "Chưa Bao Giờ",
        artist: "Chi Pu",
        url: chuaBaoGioMusic,
        fileName: "Chưa Bao Giờ - Chi Pu.mp3",
        description: "",
        active: true,
        order: 4,
        duration: "04:26",
        playCount: 0
    },

    {
        id: "music-05",
        title: "Gimme Dat Love",
        artist: "i-dle",
        url: gimmeDatLoveMusic,
        fileName: "Gimme Dat Love - i-dle.mp3",
        description: "",
        active: true,
        order: 5,
        duration: "02:46",
        playCount: 0
    },

    {
        id: "music-06",
        title: "Mashup HIT Tiktok Trung Douyin 2020",
        artist: "Nhiều nghệ sĩ",
        url: mashupDouyinMusic,
        fileName: "Mashup HIT Tiktok Trung Douyin 2020.mp3",
        description: "",
        active: true,
        order: 6,
        duration: "03:51",
        playCount: 0
    },

    {
        id: "music-07",
        title: "Sakura",
        artist: "Ikimonogakari",
        url: sakuraMusic,
        fileName: "Sakura - Ikimonogakari.mp3",
        description: "",
        active: true,
        order: 7,
        duration: "05:57",
        playCount: 0
    },

    {
        id: "music-08",
        title: "Garden",
        artist: "Minnie ((G)I-DLE)",
        url: gardenMusic,
        fileName: "garden.mp3",
        description: "Nhạc nền mặc định của Khu Vườn.",
        active: true,
        order: 8,
        duration: "07:36",
        playCount: 0
    }
];

function Landing() {

    const navigate = useNavigate();

    const [showPopup, setShowPopup] = useState(false);

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const [progress, setProgress] = useState(0);

    const openFacebook = () => {

        window.open(
            FACEBOOK_LINK,
            "_blank"
        );

    };

    const handleEnter = async () => {

    if (loading) {

        return;

    }

    setLoading(true);

    const assets = [

        { src: homeBg },

        { src: homeHeading },

        { src: homeMusic },

        { src: homeBack },

        { src: homeBoardCounter },

        { src: searchBox },

        { src: tagTemplate },

        { src: randomBoard },

        { src: randomBtn },

        { src: rankingBoard },

        { src: top1 },

        { src: top2 },

        { src: top3 },

        { src: teaLeaf },

        { src: frame01 },

        { src: randomGif },

        { src: randomLeaf },

        {

            src: bgMusic,

            type: "audio"

        },

        {

            src: randomSound,

            type: "audio"

        }

    ];

    const start = performance.now();

    const preloadPromise =

    preloadAssets(

        assets,

        setProgress

    );

const charactersPromise =

    getCharacters();

await preloadPromise;

const characters =

    await charactersPromise;

    await Promise.all(

    characters.map(

        character => {

            if (

                !character.avatar

            ) {

                return Promise.resolve();

            }

            return new Promise(

                resolve => {

                    const img = new Image();

img.onload = async () => {

    if (

        img.decode

    ) {

        try {

            await img.decode();

        }

        catch {}

    }

    resolve();

};

img.onerror =

    resolve;

img.src =

character.avatar;

                }

            );

        }

    )

);

    const elapsed = performance.now() - start;

    if (elapsed < 2000) {

        await new Promise(resolve =>

            setTimeout(

                resolve,

                2000 - elapsed

            )

        );

    }

    navigate(

    "/home",

    {

        state: {

            characters

        }

    }

);

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

    progress={progress}

/>

        </div>

    );

}

export default Landing;