"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.R18 = void 0;
var logger_1 = require("../common/logger");
var logger = (0, logger_1.LOGGER)('provider:r18');
var R18 = /** @class */ (function () {
    function R18(base_url) {
        this.base_url = base_url || "https://r18.dev";
    }
    R18.prototype.getRawData = function (movie_code) {
        return __awaiter(this, void 0, void 0, function () {
            var url, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        movie_code = movie_code.replace(/ /g, "").replace(/"/g, "");
                        logger.debug({ movie_code: movie_code }, "f:getRawData:movie_code");
                        url = new URL("/videos/vod/movies/detail/-/dvd_id=".concat(movie_code, "/json"), this.base_url);
                        logger.debug({ url: url }, "f:getRawData:url");
                        return [4 /*yield*/, fetch(url, {
                                method: "GET",
                            })];
                    case 1:
                        response = _a.sent();
                        logger.debug({ status: response.status, statusText: response.statusText }, "f:getRawData:response:status");
                        return [4 /*yield*/, response.json()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    R18.prototype.getJsonData = function (rawData) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function () {
            var url, response, d, details, actress, screenshots, tags, result;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        url = new URL("/videos/vod/movies/detail/-/combined=".concat(rawData.content_id, "/json"), this.base_url).href;
                        return [4 /*yield*/, fetch(url, {
                                method: "GET",
                            })];
                    case 1:
                        response = _f.sent();
                        if (!response.ok) {
                            logger.error({ status: response.status, statusText: response.statusText }, "f:getJsonData:response:status");
                            throw new Error("Request failed with status code ".concat(response.status));
                        }
                        return [4 /*yield*/, response.json()];
                    case 2:
                        d = _f.sent();
                        details = {
                            director: (_a = d.directors.map(function (d) { return d.name_romaji; })) !== null && _a !== void 0 ? _a : null,
                            release_date: (_b = d.release_date) !== null && _b !== void 0 ? _b : undefined,
                            runtime: (_c = d.runtime_mins) !== null && _c !== void 0 ? _c : undefined,
                            studio: (_d = d.maker_name_en) !== null && _d !== void 0 ? _d : undefined,
                        };
                        actress = d["actresses"].map(function (a) { return ({
                            name: a["name_romaji"],
                            image: new URL(a["image_url"], "https://pics.dmm.co.jp/mono/actjpgs/").toString(),
                        }); });
                        screenshots = d["gallery"].map(function (g) { return g["image_full"]; });
                        tags = d["categories"].map(function (c) { return c["name_en"]; });
                        result = {
                            id: d["dvd_id"],
                            title: d["title_en"],
                            title_ja: d["title_ja"],
                            page: "https://r18.dev/videos/vod/movies/detail/-/id=".concat(d["content_id"], "/"),
                            poster: d["jacket_full_url"],
                            preview: (_e = d["sample_url"]) !== null && _e !== void 0 ? _e : undefined,
                            details: details,
                            actress: actress,
                            screenshots: screenshots,
                            tags: tags,
                        };
                        return [2 /*return*/, result];
                }
            });
        });
    };
    R18.prototype.search = function (code) {
        return __awaiter(this, void 0, void 0, function () {
            var rawData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getRawData(code)];
                    case 1:
                        rawData = _a.sent();
                        return [4 /*yield*/, this.getJsonData(rawData)];
                    case 2: 
                    // 2nd get the json data
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return R18;
}());
exports.R18 = R18;
// export const r18Provider = new R18();
// r18Provider.search("EBOD-391").then((res) => logger.info(res));
