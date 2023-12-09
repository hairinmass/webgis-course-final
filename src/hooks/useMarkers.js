
export const useMarkers = () => {
    const getData = async (url) => {
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        return data
    }

    return { getData }
}
