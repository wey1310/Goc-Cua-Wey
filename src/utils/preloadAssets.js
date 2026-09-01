function preloadImage(src) {

    return new Promise((resolve) => {

        if (!src) {

            resolve();

            return;

        }

        const img = new Image();

        img.onload = async () => {

            if (img.decode) {

                try {

                    await img.decode();

                }

                catch {}

            }

            resolve();

        };

        img.onerror = resolve;

        img.src = src;

    });

}

function preloadAudio(src) {

    return new Promise((resolve) => {

        if (!src) {

            resolve();

            return;

        }

        const audio = new Audio();

        audio.preload = "auto";

        audio.oncanplaythrough = resolve;

        audio.onerror = resolve;

        audio.src = src;

        audio.load();

    });

}

export default async function preloadAssets(

    assets,

    onProgress

) {

    const total = assets.length;

    let loaded = 0;

    for (const asset of assets) {

        switch (asset.type) {

            case "audio":

                await preloadAudio(

                    asset.src

                );

                break;

            default:

                await preloadImage(

                    asset.src

                );

                break;

        }

        loaded++;

        onProgress?.(

            Math.round(

                loaded /

                total *

                100

            )

        );

    }

}