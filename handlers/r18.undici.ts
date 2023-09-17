import { request } from "undici";
import type { response } from '../common/types'

interface rawData {
    actors: any[];
    actresses: { id: number; image_url: string; name_kana: string; name_kanji: string; name_romaji: string; }[];
    authors: any[];
    categories: { id: number; name_en: string; name_en_is_machine_translation: boolean; name_ja: string; }[];
    comment_en: null | string;
    content_id: string;
    directors: { id: number; name_kana: string; name_kanji: string; name_romaji: string; }[];
    dvd_id: string;
    gallery: { image_full: string; image_thumb: string; }[];
    histrions: any[];
    jacket_full_url: string;
    jacket_thumb_url: string;
    label_id: number;
    label_name_en: string;
    label_name_ja: string;
    maker_id: null | number;
    maker_name_en: string;
    maker_name_ja: string;
    release_date: string;
    runtime_mins: number;
    sample_url: string;
    series_id: null | number;
    service_code: string;
    site_id: number;
    title_en: string;
    title_en_is_machine_translation: boolean;
    title_ja: string;
}


class R18 {
    base_url: string;
    constructor(base_url: string = "https://r18.dev") {
        this.base_url = base_url;
    }

    /**
     * Asynchronously generates a dictionary containing relevant information about a DVD from a request response object.
     * @param res - A Response object from an HTTP request.
     * @returns A dictionary containing the relevant information about the DVD.
     */
    private async __generate_result(d: rawData): Promise<response> {
        const details = {
            director: d.directors.map(d => d.name_romaji) ?? null,
            release_date: d.release_date ?? undefined,
            runtime: d.runtime_mins ?? undefined,
            studio: d.maker_name_en ?? undefined
        };
        const actress = d["actresses"].map((a: { name_romaji: string, image_url: string }) => ({
            name: a["name_romaji"],
            image: new URL(a["image_url"], "https://pics.dmm.co.jp/mono/actjpgs/").toString()
        }));
        const screenshots = d["gallery"].map((g: { image_full: string }) => g["image_full"]);
        const tags = d["categories"].map((c: { name_en: string }) => c["name_en"]);

        return {
            id: d["dvd_id"],
            title: d["title_en"],
            title_ja: d["title_ja"],
            page: `https://r18.dev/videos/vod/movies/detail/-/id=${d["content_id"]}/`,
            poster: d["jacket_full_url"],
            preview: d["sample_url"] ?? undefined,
            details,
            actress,
            screenshots,
            tags
        };
    }



    /**
     * Searches for content with the given code on r18.dev.
     * @param code - The code to search for.
     * @returns The content found, or null if there was an error.
     */
    public async search(code: string): Promise<response | undefined> {
        try {
            code = code.replace(/ /g, '').replace(/"/g, '');
            let {
                statusCode,
                body
            } = await request(
                new URL(`/videos/vod/movies/detail/-/dvd_id=${code}/json`, this.base_url).href,
            )

            if (statusCode !== 200) {
                throw new Error(`Request failed with status code ${statusCode}\nCode: ${code}`);
            } else {
                const res = await body.json();
                ({ body } = await request(new URL(`/videos/vod/movies/detail/-/combined=${res.content_id}/json`, this.base_url).href));
                const jsonBody: rawData = await body.json();
                if (!jsonBody) {
                    throw new Error('Failed to parse JSON response');
                }
                return await this.__generate_result(jsonBody);
            }
        } catch (error) {
            // Handle error
            console.error(error);
            return undefined;
        }

    }
}


const r18 = new R18();
export default r18;

// r18.search("EBOD-391").then(res => console.log(res));