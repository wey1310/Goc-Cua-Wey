import React, {

    useEffect,

    useState

} from "react";

import styles from "./CharacterPopup.module.css";

import bgBookLink from "../../assets/ui/popup-book-link.png";
import bgBookUnlink from "../../assets/ui/popup-book-unlink.png";
import { motion } from "framer-motion";

import cupFeedback from "../../assets/ui/cup-feedback.png";
import unlikeLeaf from "../../assets/ui/leaf-unlike.png";
import likeLeaf from "../../assets/ui/leaf-like.png";
import avatarFrame from "../../assets/ui/popup-avatar-frame.png";
import quoteBox from "../../assets/ui/popup-quote-box.png";
import cupGgai from "../../assets/ui/cup-ggai.png";
import cupPlot from "../../assets/ui/cup-plot.png";
import closeBtn from "../../assets/ui/popup-close.png";
import FeedbackPopup from "../FeedbackPopup/FeedbackPopup";

import {
    increaseGGAIClick
} from "../../services/characterService";


function CharacterPopup({

    character,

    onClose,

    onRefresh

}) {

    if (!character) return null;


    const [

    liked,

    setLiked

] = useState(false);

const [

    likes,

    setLikes

] = useState(

    character.leafCount ?? 0

);

    const [

    openFeedback,

    setOpenFeedback

] = useState(false);

    const toggleLike = () => {

    if (liked) {

        setLikes((prev) => prev - 1);

    }

    else {

        setLikes((prev) => prev + 1);

    }

    setLiked(!liked);

};

    // ================= Link =================

    const ggaiLink = character.ggaiLink || character.ggai;

    const plotLink = character.plotLink || character.plot;

    const hasGGAI = !!ggaiLink;

    const hasPlot = !!plotLink;

    // Có ít nhất 1 link -> Book Link
    // Không có gì -> Book Unlink

    const hasLink = hasGGAI || hasPlot;

// ================= Display =================

    const avatar =

        character.avatar ||

        "https://placehold.co/300x300?text=Avatar";

    const name =

        character.name ||

        "Chưa có tên";

    const quote =

        character.quote ||

        "Chưa có Quote.";

    const tags =

        character.tags?.length

            ? character.tags.join(" • ")

            : "Chưa có tag";

    const views =

        Number(character.views || 0)

            .toLocaleString();

    const leafCount =

        character.leafCount ?? 0;

    const bookImage =

        hasLink

            ? bgBookLink

            : bgBookUnlink;

    // ================= Open =================

    const openLink = async (

    link,

    isGGAI = false

) => {

    if (!link){

        return;

    }

    if(isGGAI){

        try{

        await increaseGGAIClick(

    character.id

);

await onRefresh?.();

        }

        catch(error){

            console.error(

                "Update ggai:",

                error

            );

        }

    }

    window.open(

        link,

        "_blank",

        "noopener,noreferrer"

    );

};

    return (

        <div className={styles.overlay}>

            <div

                className={styles.backdrop}

                onClick={onClose}

            />

            <div className={styles.popupWrapper}>

                {/* ================= Book ================= */}

                <img

                    src={bookImage}

                    alt="Popup"

                    className={styles.bgImage}

                />

                {/* ================= Counter ================= */}

                <div className={styles.likeContainer}>

    <motion.img
        src={
            liked
                ? likeLeaf
                : unlikeLeaf
        }
        className={styles.likeLeaf}
        style={{
            marginLeft: liked ? "-8px" : "4px",
            marginTop: liked ? "4px" : "3px",
        }}
        whileTap={{
            scale: .85
        }}
        animate={{
            scale: liked ? [1, 1.18, 1] : [1, .92, 1],
            rotate: liked ? [0, -10, 10, 0] : [0, 5, -5, 0]
        }}
        transition={{
            duration: .35
        }}
        onClick={toggleLike}
    />

    <div className={styles.likeCounter}>
        {likes}
    </div>

</div>

<div
    className={styles.feedbackContainer}
    onClick={() => setOpenFeedback(true)}
>
    <img
        src={cupFeedback}
        alt="Feedback"
        className={styles.feedbackIcon}
    />
</div>



                {/* ================= Avatar ================= */}

                <div className={styles.avatarWrapper}>

                    <div className={styles.avatarMask}>

                    <img
                    
                        src={avatar}

                        alt={name}

                        className={styles.avatarImg}
                    />

                    </div>

                    <img

                        src={avatarFrame}

                        alt=""

                        className={styles.avatarFrame}

                    />

                </div>

                {/* ================= Info ================= */}

                <div className={styles.infoWrapper}>

                    <h2 className={styles.characterName}>

                        🌷 {name} 🌷

                    </h2>

                    <div className={styles.tags}>

                    {tags}

                    </div>

                </div>

                {/* ================= Quote ================= */}

                <div className={styles.quoteWrapper}>

                    <img

                        src={quoteBox}

                        alt=""

                        className={styles.quoteBg}

                    />

                    <div className={styles.quoteTextContainer}>

                        <p>

                            {quote}

                        </p>

                    </div>

                </div>

                {/* ================= Cups ================= */}

                <div className={styles.cupsWrapper}>

                    {/* GGAI */}

                    <div

                        className={`${styles.cupBtn} ${!hasGGAI ? styles.disabled : ""}`}

                        onClick={() => openLink(

    ggaiLink,

    true

)}

                        title={

                            hasGGAI

                                ?

                                "Thưởng trà GGAI"

                                :

                                "Chưa có GGAI"

                        }

                    >

                        <img

                            src={cupGgai}

                            alt=""

                            className={styles.cupImg}

                        />

                    </div>

                    {/* Plot */}

                    <div

                        className={`${styles.cupBtn} ${!hasPlot ? styles.disabled : ""}`}

                        onClick={() => openLink(plotLink)}

                        title={

                            hasPlot

                                ?

                                "Thưởng trà Plot"

                                :

                                "Chưa có Plot"

                        }

                    >

                        <img

                            src={cupPlot}

                            alt=""

                            className={styles.cupImg}

                        />

                    </div>

                   

                </div>

                {/* ================= Close ================= */}

                <div

                    className={styles.closeBtnWrapper}

                    onClick={onClose}

                >

                    <img

                        src={closeBtn}

                        alt="Close"

                        className={styles.closeBtnImg}

                    />

                </div>

       

                   </div>

            {

                openFeedback && (

                    <FeedbackPopup

                        character={character}

                        onClose={() =>

                            setOpenFeedback(false)

                        }

                    />

                )

            }

        </div>

    );

}

export default CharacterPopup;