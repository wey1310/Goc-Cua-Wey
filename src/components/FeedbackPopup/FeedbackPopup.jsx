import {

    useState,

    useEffect,

    useRef,

    useMemo

} from "react";

import {

    motion,

    AnimatePresence

} from "framer-motion";

import toast from "react-hot-toast";

import styles from "./FeedbackPopup.module.css";

/* =====================================================
   COMPONENT
===================================================== */

function FeedbackPopup({

    character,

    onClose

}){

    /* =====================================================
       USER
    ===================================================== */

    const [

        currentUserId

    ] = useState(() => {

        let id = localStorage.getItem(

            "wey-user-id"

        );

        if(

            !id

        ){

            id = crypto.randomUUID();

            localStorage.setItem(

                "wey-user-id",

                id

            );

        }

        return id;

    });

    /* =====================================================
       INPUT
    ===================================================== */

    const [

        guestName,

        setGuestName

    ] = useState(

        localStorage.getItem(

            "wey-guest-name"

        ) || ""

    );

    const [

        message,

        setMessage

    ] = useState("");

    /* =====================================================
       STATE
    ===================================================== */

    const [

        feedbacks,

        setFeedbacks

    ] = useState([]);

    const [

        isSending,

        setIsSending

    ] = useState(false);

    const [

        flyingLeaves,

        setFlyingLeaves

    ] = useState([]);

    const [

        popupReady,

        setPopupReady

    ] = useState(false);

    /* =====================================================
       REF
    ===================================================== */

    const textareaRef = useRef(null);

    const inputRef = useRef(null);

    /* =====================================================
       MEMO
    ===================================================== */

    const feedbackCount = useMemo(

        () => feedbacks.length,

        [

            feedbacks

        ]

    );

    /* =====================================================
       CHARACTER
    ===================================================== */

    const characterId =

        character?.id;

    const characterName =

        character?.name ||

        "Unknown";
    /* =====================================================
       LOAD FEEDBACK
    ===================================================== */

    useEffect(() => {

        const saved = JSON.parse(

            localStorage.getItem(

                "wey-feedbacks"

            ) || "[]"

        );

        setFeedbacks(

            saved.filter(

                item =>

                    item.characterId ===

                    characterId

            )

        );

        setPopupReady(

            true

        );

    }, [

        characterId

    ]);

    /* =====================================================
       SAVE FEEDBACK
    ===================================================== */

    useEffect(() => {

        if(

            !popupReady

        ){

            return;

        }

        const allFeedbacks = JSON.parse(

            localStorage.getItem(

                "wey-feedbacks"

            ) || "[]"

        );

        const otherCharacters = allFeedbacks.filter(

            item =>

                item.characterId !==

                characterId

        );

        localStorage.setItem(

            "wey-feedbacks",

            JSON.stringify([

                ...otherCharacters,

                ...feedbacks

            ])

        );

    }, [

        feedbacks,

        popupReady,

        characterId

    ]);

    /* =====================================================
       AUTO FOCUS
    ===================================================== */

    useEffect(() => {

        textareaRef.current?.focus();

    }, []);

    /* =====================================================
       ESC CLOSE
    ===================================================== */

    useEffect(() => {

        function handleEscape(e){

            if(

                e.key === "Escape"

            ){

                onClose();

            }

        }

        window.addEventListener(

            "keydown",

            handleEscape

        );

        return () => {

            window.removeEventListener(

                "keydown",

                handleEscape

            );

        };

    }, [

        onClose

    ]);

    /* =====================================================
       TIME FORMAT
    ===================================================== */

    function formatTime(timestamp){

        const diff = (

            Date.now() -

            timestamp

        ) / 1000;

        if(

            diff < 60

        ){

            return "Vừa xong";

        }

        if(

            diff < 3600

        ){

            return `${

                Math.floor(

                    diff / 60

                )

            } phút trước`;

        }

        if(

            diff < 86400

        ){

            return `${

                Math.floor(

                    diff / 3600

                )

            } giờ trước`;

        }

        if(

            diff <

            86400 * 7

        ){

            return `${

                Math.floor(

                    diff / 86400

                )

            } ngày trước`;

        }

        return new Date(

            timestamp

        ).toLocaleDateString(

            "vi-VN"

        );

    }

    /* =====================================================
       RANDOM LEAF
    ===================================================== */

    function createLeaf(){

        return{

            id:

                crypto.randomUUID(),

            left:

                Math.random() * 100,

            rotate:

                Math.random() * 360,

            delay:

                Math.random() * .3

        };

    }

    /* =====================================================
       CTRL + ENTER
    ===================================================== */

    function handleKeyDown(e){

        if(

            e.ctrlKey &&

            e.key === "Enter"

        ){

            handleSubmit();

        }

    }
    /* =====================================================
       SUBMIT
    ===================================================== */

    function handleSubmit(){

        if(

            isSending

        ){

            return;

        }

        const name =

            guestName.trim();

        const text =

            message.trim();

        if(

            !name

        ){

            toast.error(

                "Hãy nhập tên của bạn."

            );

            inputRef.current?.focus();

            return;

        }

        if(

            !text

        ){

            toast.error(

                "Hãy nhập nội dung."

            );

            textareaRef.current?.focus();

            return;

        }

        const duplicated = feedbacks.some(

            item =>

                item.userId === currentUserId &&

                item.message === text

        );

        if(

            duplicated

        ){

            toast.error(

                "Bạn vừa gửi nội dung này rồi."

            );

            return;

        }

        setIsSending(

            true

        );

        localStorage.setItem(

            "wey-guest-name",

            name

        );

        const newFeedback = {

            id:

                crypto.randomUUID(),

            characterId,

            userId:

                currentUserId,

            name,

            message:

                text,

            createdAt:

                Date.now()

        };

        setFeedbacks(

            prev => [

                newFeedback,

                ...prev

            ]

        );

        const leaves = Array.from(

            {

                length:8

            },

            () =>

                createLeaf()

        );

        setFlyingLeaves(

            leaves

        );

        setTimeout(

            () => {

                setFlyingLeaves(

                    []

                );

            },

            1800

        );

        setMessage(

            ""

        );

        textareaRef.current?.focus();

        toast.success(

            "Đã gửi lời nhắn 🌿"

        );

        setTimeout(

            () => {

                setIsSending(

                    false

                );

            },

            500

        );

    }

    /* =====================================================
       DELETE
    ===================================================== */

    function handleDelete(id){

        setFeedbacks(

            prev =>

                prev.filter(

                    item =>

                        item.id !== id

                )

        );

        toast.success(

            "Đã xoá bình luận."

        );

    }

/* =====================================================
   AUTO RESIZE
===================================================== */

useEffect(() => {

    if (

        !textareaRef.current

    ) {

        return;

    }

    if (

        window.innerWidth <= 640

    ) {

        textareaRef.current.style.height = "";

        return;

    }

    textareaRef.current.style.height = "0px";

    textareaRef.current.style.height =

        `${textareaRef.current.scrollHeight}px`;

}, [

    message

]);

    /* =====================================================
       ANIMATION
    ===================================================== */

    const bubbleAnimation = {

        hidden:{

            opacity:0,

            y:18,

            scale:.96

        },

        visible:{

            opacity:1,

            y:0,

            scale:1,

            transition:{

                duration:.28

            }

        },

        exit:{

            opacity:0,

            x:30,

            transition:{

                duration:.18

            }

        }

    };

    const popupAnimation = {

        hidden:{

            opacity:0,

            scale:.94,

            y:20

        },

        visible:{

            opacity:1,

            scale:1,

            y:0,

            transition:{

                duration:.3

            }

        },

        exit:{

            opacity:0,

            scale:.96,

            y:20,

            transition:{

                duration:.2

            }

        }

    };
    /* =====================================================
       RENDER
    ===================================================== */

    return(

        <AnimatePresence>

            <motion.div

                className={styles.overlay}

                initial="hidden"

                animate="visible"

                exit="exit"

                variants={popupAnimation}

            >

                <div

                    className={styles.backdrop}

                    onClick={onClose}

                />

                {flyingLeaves.map(

                    leaf => (

                        <motion.div

                            key={leaf.id}

                            className={styles.flyingLeaf}

                            initial={{

                                opacity:1,

                                y:0,

                                rotate:leaf.rotate

                            }}

                            animate={{

                                opacity:0,

                                y:-220,

                                rotate:

                                    leaf.rotate + 180

                            }}

                            transition={{

                                duration:1.8,

                                delay:leaf.delay,

                                ease:"easeOut"

                            }}

                            style={{

                                left:`${leaf.left}%`

                            }}

                        >

                            🍃

                        </motion.div>

                    )

                )}

                <motion.div

                    className={styles.popup}

                    variants={popupAnimation}

                >

                    <div className={styles.header}>

                        <div>

                            <h2 className={styles.title}>

                                🍃 Lưu bút vườn trà 🍃

                            </h2>

                            <p className={styles.subtitle}>

                                Dành cho

                                {" "}

                                <strong>

                                    {characterName}

                                </strong>

                            </p>

                        </div>

                        <button

                            className={styles.closeBtn}

                            onClick={onClose}

                        >

                            ✕

                        </button>

                    </div>

                    <div className={styles.content}>

                        <div className={styles.leftPanel}>

                            <label className={styles.label}>

                                Tên trà hữu

                            </label>

                            <input

                                ref={inputRef}

                                className={styles.input}

                                value={guestName}

                                maxLength={30}

                                onChange={e =>

                                    setGuestName(

                                        e.target.value

                                    )

                                }

                                placeholder="Tên của bạn..."

                            />

                            <label className={styles.label}>

                                Đôi dòng tâm sự

                            </label>

                            <textarea

                                ref={textareaRef}

                                className={styles.textarea}

                                value={message}

                                maxLength={300}

                                onKeyDown={handleKeyDown}

                                onChange={e =>

                                    setMessage(

                                        e.target.value

                                    )

                                }

                                placeholder="Để lại chút hương trà và những câu chuyện của bạn..."

                            />

                            <div className={styles.counter}>

                                {message.length}

                                /300

                            </div>

                            <motion.button

                                whileHover={{

                                    scale:1.03

                                }}

                                whileTap={{

                                    scale:.97

                                }}

                                disabled={isSending}

                                onClick={handleSubmit}

                                className={styles.sendBtn}

                            >

                                🍵 Thả lời theo gió

                            </motion.button>

                        </div>

                        <div className={styles.rightPanel}>

                            <div className={styles.listHeader}>

                                {feedbackCount}

                                {" "}

                                lời nhắn

                            </div>

                            <div className={styles.feedbackList}>

                                {

                                    feedbackCount === 0 ?

                                    (

                                        <div

                                            className={styles.empty}

                                        >

                                            <div

                                                className={styles.emptyIcon}

                                            >

                                                🌿

                                            </div>

                                            <p>

                                                Vườn trà còn yên ắng

                                            </p>

                                            <span>

                                                Hãy gieo một hạt mầm tâm sự đầu tiên vào khu vườn này nhé.

                                            </span>

                                        </div>

                                    )

                                    :

                                    (

                                        <AnimatePresence>

                                            {

                                                feedbacks.map(

                                                    item => (

                                                        <motion.div

                                                            key={item.id}

                                                            layout

                                                            variants={bubbleAnimation}

                                                            initial="hidden"

                                                            animate="visible"

                                                            exit="exit"

                                                            className={styles.feedbackBubble}

                                                        >

                                                            <div className={styles.feedbackTop}>

                                                                <div className={styles.userInfo}>

                                                                    <div className={styles.avatar}>

                                                                        {

                                                                            item.name

                                                                                .charAt(0)

                                                                                .toUpperCase()

                                                                        }

                                                                    </div>

                                                                    <div>

                                                                        <strong>

                                                                            {item.name}

                                                                        </strong>

                                                                        <span>

                                                                            {

                                                                                formatTime(

                                                                                    item.createdAt

                                                                                )

                                                                            }

                                                                        </span>

                                                                    </div>

                                                                </div>

                                                                {

                                                                    item.userId ===

                                                                    currentUserId && (

                                                                        <button

                                                                            className={styles.deleteBtn}

                                                                            onClick={() =>

                                                                                handleDelete(

                                                                                    item.id

                                                                                )

                                                                            }

                                                                        >

                                                                            🗑️

                                                                        </button>

                                                                    )

                                                                }

                                                            </div>

                                                            <div className={styles.messageBubble}>

                                                                {

                                                                    item.message

                                                                }

                                                            </div>

                                                        </motion.div>

                                                    )

                                                )

                                            }

                                        </AnimatePresence>

                                    )

                                }

                            </div>

                        </div>

                    </div>

                </motion.div>

            </motion.div>

        </AnimatePresence>

    );

}

export default FeedbackPopup;