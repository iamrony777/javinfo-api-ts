import {
  providerResponse,
  r18ApiResponseByContentId,
  r18ApiResponseByDvdId,
} from "../common/types";
import { LOGGER } from "../common/logger";

const logger = LOGGER('provider:r18');

export class R18 {
  private base_url: string;
  constructor(base_url?: string) {
    this.base_url = base_url || "https://r18.dev";
  }

  private async getRawData(movie_code: string): Promise<r18ApiResponseByDvdId> {
    movie_code = movie_code.replace(/ /g, "").replace(/"/g, "");
    logger.debug({ movie_code }, "f:getRawData:movie_code");

    const url = new URL(
      `/videos/vod/movies/detail/-/dvd_id=${movie_code}/json`,
      this.base_url
    );
    logger.debug({ url }, "f:getRawData:url");

    const response = await fetch(url, {
      method: "GET",
    });

    logger.debug(
      { status: response.status, statusText: response.statusText },
      "f:getRawData:response:status"
    );
    return await response.json();
  }
  private async getJsonData(rawData: r18ApiResponseByDvdId) {
    const url = new URL(
      `/videos/vod/movies/detail/-/combined=${rawData.content_id}/json`,
      this.base_url
    ).href;

    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      logger.error(
        { status: response.status, statusText: response.statusText },
        "f:getJsonData:response:status"
      );
      throw new Error(`Request failed with status code ${response.status}`);
    }

    const d: r18ApiResponseByContentId = await response.json();

    const details = {
      director: d.directors.map((d) => d.name_romaji) ?? null,
      release_date: d.release_date ?? undefined,
      runtime: d.runtime_mins ?? undefined,
      studio: d.maker_name_en ?? undefined,
    };

    const actress = d["actresses"].map(
      (a: { name_romaji: string; image_url: string }) => ({
        name: a["name_romaji"],
        image: new URL(
          a["image_url"],
          "https://pics.dmm.co.jp/mono/actjpgs/"
        ).toString(),
      })
    );

    const screenshots = d["gallery"].map(
      (g: { image_full: string }) => g["image_full"]
    );
    const tags = d["categories"].map((c: { name_en: string }) => c["name_en"]);

    const result = {
      id: d["dvd_id"],
      title: d["title_en"],
      title_ja: d["title_ja"],
      page: `https://r18.dev/videos/vod/movies/detail/-/id=${d["content_id"]}/`,
      poster: d["jacket_full_url"],
      preview: d["sample_url"] ?? undefined,
      details,
      actress,
      screenshots,
      tags,
    };

    return result;
  }

  public async search(code: string): Promise<providerResponse> {
    // 1st get the rawdata
    const rawData = await this.getRawData(code);
    // 2nd get the json data
    return await this.getJsonData(rawData);
  }
}

// export const r18Provider = new R18();
// r18Provider.search("EBOD-391").then((res) => logger.info(res));
