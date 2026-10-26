import axios from "axios";

const cache = new Map();

const countriesClient = axios.create({
  baseURL: "https://restcountries.com/v3.1",
  timeout: 12000,
});

export const fetchCountryInfo = async (countryName) => {
  if (!countryName) return null;

  const normalizedName = String(countryName).trim();

  if (cache.has(normalizedName)) {
    return cache.get(normalizedName);
  }

  const response = await countriesClient.get(
    `/name/${encodeURIComponent(normalizedName)}?fullText=true`,
    {
      params: {
        fields: "name,capital,region,subregion,flags,cca2",
      },
    },
  );

  const country = Array.isArray(response.data) ? response.data[0] : null;

  if (!country) {
    return null;
  }

  cache.set(normalizedName, country);

  return country;
};
