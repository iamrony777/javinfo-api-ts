import { response, error } from "./types";
export const httpStatusMessages: Record<number, string> = {
  100: 'Continue',
  101: 'Switching Protocols',
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'Non-Authoritative Information',
  204: 'No Content',
  205: 'Reset Content',
  206: 'Partial Content',
  300: 'Multiple Choices',
  301: 'Moved Permanently',
  302: 'Found',
  303: 'See Other',
  304: 'Not Modified',
  305: 'Use Proxy',
  306: '(Unused)',
  307: 'Temporary Redirect',
  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  407: 'Proxy Authentication Required',
  408: 'Request Timeout',
  409: 'Conflict',
  410: 'Gone',
  411: 'Length Required',
  412: 'Precondition Failed',
  413: 'Payload Too Large',
  414: 'URI Too Long',
  415: 'Unsupported Media Type',
  416: 'Range Not Satisfiable',
  417: 'Expectation Failed',
  418: 'I\'m a Teapot',
  421: 'Misdirected Request',
  422: 'Unprocessable Entity',
  423: 'Too Early',
  424: 'Locked',
  425: 'Unavailable For Legal Reasons',
  426: 'Policy Not Allowed',
  427: 'Expecting One-Time Token',
  428: 'WWW-Authenticate',
  429: 'Unauthorized',
  430: 'Forbidden',
  431: 'Request Header Fields Too Large',
  432: 'Unprocessable Entity',
  433: 'Forbidden',
  500: 'Internal Server error',
};

export function isResponse(object: any): object is response {
  return (object && 'id' in object) ? true : false;
}

export function isError(object: any): object is error {
  return (object && 'message' in object) ? true : false;
}

// export async function getPage(url: string, client?: typeof cloudscraper | undefined): Promise<request.response> {
//   return new Promise((resolve, reject) => {
//     if (client) {
//       client.get(url, function (error: error, response: request.response) {
//         if (error) {
//           reject(error);
//         } else {
//           resolve(response);
//         }
//       });
//     } else {
//       cloudscraper.get(url, function (error: error, response: request.response) {
//         if (error) {
//           reject(error);
//         } else {
//           resolve(response);
//         }
//       });
//     }
//   });
// }