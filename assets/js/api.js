const api = axios.create({ baseURL: 'https://api.covid19api.com/' });

const getData = async (route) => {
    const response = await api.get(route);
    return response.data;
}

export { getData };