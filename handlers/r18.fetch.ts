type r18Response = {
  title: string;
  series: {
    name: string;
    series_url: number;
  };
  sample: { high: string };
  runtime_minutes: number;
  release_date: string;
  maker: {
    name: string;
  };
  label: {
    name: string;
  };
  images: {
    jacket_image: {
      large: "";
      large2: "";
    };
  };
  director: string;
  content_id: string;
  categories: Array<{
    name: string;
  }>;
  actresses: Array<{
    name: string;
  }>;
};

class R18 {
  private base_url: string;
  constructor(base_url: string = "https://r18.dev") {
    this.base_url = base_url;
  }

  public async search(code: string) {
    code = code.replace(/ /g, "").replace(/"/g, "");
    const url = new URL(
      `/videos/vod/movies/detail/-/dvd_id=${code}/json`,
      this.base_url
    );
    const response = await fetch(url, {
      method: "GET",
    });
    return await response.json<r18Response>();
  }
}

const r18 = new R18();
r18.search("EBOD-391").then((res) => console.log(res));
