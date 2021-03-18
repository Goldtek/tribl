//@ts-ignore
import countryList from 'countries-db';

let instance: null | Country = null;

class Country {
  private countries: null | CountryInterface[];

  constructor() {
    this.countries = null;
  }

  static getInstance() {
    if (!instance) {
      instance = new Country();
    }
    return instance;
  }

  getAllCountries(): CountryInterface[] {
    if (!this.countries) {
      const allCountries = countryList.getAllCountries();
      this.countries = Object.values(allCountries).sort(
        (a: any, b: any) => b.name - a.name
      ) as CountryInterface[];
    }

    return this.countries;
  }

  getCountry(iso2?: string): CountryInterface {
    return countryList.getCountry(iso2?.toUpperCase());
  }

  getFlag(countryCode: string): string {
    const country = countryList.getAllCountries() as {
      [name: string]: CountryInterface;
    };

    return country[countryCode].emoji;
  }

  searchCountry(countryName: string): CountryInterface[] {
    if (this.countries) {
      return this.countries.filter(({ name }) =>
        name.toLowerCase().includes(countryName.toLowerCase())
      );
    }

    return this.getAllCountries().filter(({ name }) =>
      name.toLowerCase().includes(countryName.toLowerCase())
    );
  }
}

export default Country.getInstance();

export interface CountryInterface {
  id: string;
  name: string;
  officialName: string;
  emoji: string;
  emojiUnicode: string;
  iso2: string;
  iso3: string;
  isoNumeric: string;
  geonameId: number;
  dialCode: string;
  priority: number;
  areaCodes: null | string[];
  isEmpty?: boolean;
  continentId: string;
  population: number;
  elevation: number;
  areaSqKm: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  timezones: string[];
  domain: string;
  currencyCode: string;
  currencyName: string;
  postalCodeFormat: string;
  postalCodeRegex: string;
  phoneCode: string;
  neighborCountryIds: string[];
  languages: string[];
  locales: string[];
  selected?: boolean;
}
