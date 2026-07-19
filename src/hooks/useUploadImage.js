import { useState } from "react";

export default function useUploadImage() {

    const [preview, setPreview] = useState("");

    const upload = (file) => {

        if (!file) return "";

        const url = URL.createObjectURL(file);

        setPreview(url);

        return url;

    };

    return {

        preview,

        upload

    };

}