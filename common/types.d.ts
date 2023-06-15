interface response {
    id: string,
    title?: string,
    title_ja?: string,
    page: string,
    poster?: string,
    preview?: string ,
    details: { director: string | string[] | undefined, release_date: string | undefined, runtime: number | undefined, studio: string | undefined },
    actress: { name: string, image: string }[] | { name: string }[] | undefined,
    screenshots?: string[],
    tags?: string[]
}

interface error {
    message: string,
    statusCode: number
}


export type { response, error }
export { error, response }