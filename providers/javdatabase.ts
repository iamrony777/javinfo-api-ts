import { LOGGER } from "../common/logger";
import parse, { HTMLElement } from "node-html-parser";
import { providerResponse } from "../common/types";

const logger = LOGGER("provider:javdatabase");

export class Javdatabase {
  private base_url: string;
  private headers: Record<string, string> | Headers;
  constructor(base_url?: string, headers?: Record<string, string> | Headers) {
    this.base_url = base_url || "https://www.javdatabase.com/";
    this.headers = {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36",
      Accept: "*/*",
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
        page.getElementsByTagName("meta")?.[25].attrs?.content ||
        page.getElementsByTagName("meta")?.[26].attrs?.content,
      preview: page.getElementsByTagName("iframe")?.[0]?.attrs?.src || undefined,
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
          return { name: img.attributes.alt, image: img.attributes.src };
        }),
      screenshots: Array.from(
        page.querySelectorAll(".entry-content > div:nth-child(3) > a")
      ).map((img) => img.attributes.href),
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

// const javdatabase = new Javdatabase();
// javdatabase.search("EBOD-391").then( (result) => logger.info(result));
