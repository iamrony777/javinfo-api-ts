import { LOGGER } from "../common/logger.js";
import { type HTMLElement, parse } from "node-html-parser";
import type { providerResponse } from "../common/types.js";
import { fetch, type Headers } from "undici";

const logger = LOGGER("provider:javdatabase");


export class Javdatabase {
  private base_url: string;
  private headers: Record<string, string> ;
  constructor(base_url?: string, headers?: Record<string, string>) {
    this.base_url = base_url || "https://www.javdatabase.com/";
    this.headers = {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      "accept-language": "en-IN,en;q=0.5",
      "cache-control": "max-age=0",
      "if-modified-since": "Fri, 15 Sep 2023 07:34:34 GMT",
      "sec-ch-ua": '"Not_A Brand";v="99", "Brave";v="109", "Chromium";v="109"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "none",
      "sec-fetch-user": "?1",
      "sec-gpc": "1",
      "upgrade-insecure-requests": "1",
      // cookie:
        // "cf_clearance=waUS6InYXiaIMYosPdTDU6eYo6oIwoF55b5lOkTxAiE-1695048670-0-1-e6eb6596.284121f.5cb90b6a-0.2.1695048670",
      ...headers,
    };
  }

  private async getJsonData(
    page: HTMLElement,
    code: string
  ): Promise<providerResponse> {
    return {
      id: code,
      title: page
        .querySelector(".entry-header > h1")
        ?.text.replace(`${code} - `, ""),
      title_ja: undefined,
      page: new URL(`movies/${code.toLowerCase()}`, this.base_url).toString(),
      poster:
        page.getElementsByTagName("meta")?.[25]?.attrs?.content ||
        page.getElementsByTagName("meta")?.[26]?.attrs?.content,
      preview:
        page.getElementsByTagName("iframe")?.[0]?.attrs?.src || undefined,
      details: {
        director: page
          .querySelectorAll(
            "div.movietable > table > tr:nth-child(9) > td:nth-child(2) > span > a"
          )
          ?.map((a) => a.text.trim()),
        release_date: page.querySelector(
          "div.movietable > table > tr:nth-child(12) > td:nth-child(2)"
        )?.text,
        runtime: parseInt(
          // @ts-ignore
          page.querySelector(
            "div.movietable > table > tr:nth-child(13) > td:nth-child(2)"
          )?.text
        ),
        studio: page.querySelector(
          "div.movietable > table > tr:nth-child(8) > td:nth-child(2) > span > a"
        )?.text,
      },
      actress: page
        .querySelectorAll("div.idol-thumb > a > img")
        ?.map((img: HTMLElement) => {
          return { name: img.attributes.alt, image: img.attributes['data-src'] };
        }),
      screenshots: Array.from(
        page.querySelectorAll(".entry-content > div:nth-child(3) > a")
      ).map((img) => img.attributes.href as string),
      tags: Array.from(
        page.querySelectorAll(
          "div.movietable > table > tr:nth-child(6) > td:nth-child(2) > span > a"
        )
      ).map((a) => a.text.trim()),
    };
  }

  public async search(code: string) {
    logger.debug({ code }, "f:search:code");
    const url = new URL(`movies/${code.toLowerCase()}`, this.base_url).href;
    logger.debug({ url }, "f:search:url");
    const response = await fetch(url, {
      headers: this.headers,
      redirect: "follow",
      referrerPolicy: "strict-origin-when-cross-origin",
    });

    if (!response.ok) {
      logger.error(
        { status: response.status, statusText: response.statusText },
        "f:search:response:status"
      );
      throw new Error(`Request failed with status code ${response.status}`);
    } else {
      const page = parse(await response.text());
      return await this.getJsonData(page, code);
    }
  }
}

const javdatabase = new Javdatabase();
javdatabase.search("EBOD-391").then( (result) => logger.info(result));
// JSON.str