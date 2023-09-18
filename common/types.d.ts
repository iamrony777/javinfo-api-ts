export interface providerResponse {
  id: string;
  title?: string;
  title_ja?: string;
  page: string;
  poster?: string;
  preview?: string;
  details: {
    director: string | string[] | undefined;
    release_date: string | undefined;
    runtime: number | undefined;
    studio: string | undefined;
  };
  actress: { name: string; image: string }[] | { name: string }[] | undefined;
  screenshots?: string[];
  tags?: string[];
}

export interface providerError {
  message: string;
  statusCode: number;
}

export type r18ApiResponseByDvdId = {
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
export type r18ApiResponseByContentId = {
  actors: Array<any>;
  actresses: Array<{
    id: number;
    image_url: string;
    name_kana: string;
    name_kanji: string;
    name_romaji: string;
  }>;
  authors: Array<any>;
  categories: Array<{
    id: number;
    name_en: string;
    name_en_is_machine_translation: boolean;
    name_ja: string;
  }>;
  comment_en: string;
  content_id: string;
  directors: Array<{
    id: number;
    name_kana: string;
    name_kanji: string;
    name_romaji: string;
  }>;
  dvd_id: string;
  gallery: Array<{
    image_full: string;
    image_thumb: string;
  }>;
  histrions: Array<any>;
  jacket_full_url: string;
  jacket_thumb_url: string;
  label_id: number;
  label_name_en: string;
  label_name_ja: string;
  maker_id: number;
  maker_name_en: string;
  maker_name_ja: string;
  release_date: string;
  runtime_mins: number;
  sample_url: string;
  series_id: number;
  series_name_en: string;
  series_name_en_is_machine_translation: boolean;
  series_name_ja: string;
  service_code: string;
  site_id: number;
  title_en: string;
  title_en_is_machine_translation: boolean;
  title_ja: string;
};
