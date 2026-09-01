import { useRef, useState } from "react";

import {

    CLOUD_NAME,

    UPLOAD_PRESET

} from "../../config/cloudinary";

import toast from "react-hot-toast";

import styles from "./UploadImage.module.css";

function UploadImage({

    avatar,

    onChange

}) {

    const fileInput = useRef(null);

    const [

        uploading,

        setUploading

    ] = useState(false);

    const MAX_SIZE =

         5 * 1024 * 1024;

    const DEFAULT_AVATAR =

         "https://placehold.co/300x300?text=Avatar";

    const uploadUrl =

        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

    // ================= Choose =================

    const chooseImage = () => {

        if (!uploading) {

            fileInput.current?.click();

        }

    };

    // ================= Upload =================

    const uploadImage = async (e) => {

        const file = e.target.files?.[0];

        if (!file) return;

        // Chỉ cho upload ảnh

        if (!file.type.startsWith("image/")) {

            toast.error(

                "Vui lòng chọn file ảnh."

            );

            return;

        }

        // Giới hạn 5MB

        if (file.size > MAX_SIZE) {

            toast.error(

                "Ảnh phải nhỏ hơn 5MB."

            );

            return;

        }

        setUploading(true);

        const data = new FormData();

        data.append(

            "file",

            file

        );

        data.append(

            "upload_preset",

            UPLOAD_PRESET

        );

        try {

            const response = await fetch(

                uploadUrl,

                {

                method:"POST",

                body:data

                }

);

            if (!response.ok) {

    const error =

        await response.json();

    throw new Error(

        error.error?.message ||

        "Upload thất bại."

    );

}

            const result =

                await response.json();

            onChange(

                result.secure_url

            );

            toast.success(

                "Upload thành công!"

            );

        }

        catch (error) {

            console.error(error);

            toast.error(

                error.message ||

                "Upload thất bại."

            );

        }

        finally {

            setUploading(false);

            // Cho phép upload lại cùng 1 file

            e.target.value = "";

        }

    };

    return (

        <div className={styles.container}>

            <img

                src={

    avatar ||

    DEFAULT_AVATAR

}

                className={styles.avatar}

                alt="Avatar"

                loading="lazy"

                draggable={false}

            />

            <button

                type="button"

                className={styles.button}

                onClick={chooseImage}

                disabled={uploading}

            >

                {

                    uploading

                        ?

                        "⏳ Đang upload..."

                        :

                        "🖼 Upload Avatar"

                }

            </button>

            <input

    ref={fileInput}

    type="file"

    hidden

    multiple={false}

    accept="image/*"

    onChange={uploadImage}

/>

        </div>

    );

}

export default UploadImage;