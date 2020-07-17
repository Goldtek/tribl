import Flags from './resources/flags';

let instance: null | Country = null;

export interface CountryInterface {
  name: string;
  iso2: string;
  dialCode: string;
  priority: number;
  areaCodes: null | string[];
  isEmpty?: boolean;
}

class Country {
  private countryCodes: [];
  private countries: null | CountryInterface[];

  static getInstance() {
    if (!instance) {
      instance = new Country();
    }
    return instance;
  }

  constructor() {
    this.countryCodes = [];
    this.countries = null;
  }

  addCountryCode(iso2: string, dialCode: string, priority?: number) {
    if (!(dialCode in this.countryCodes)) {
      //@ts-ignore
      this.countryCodes[dialCode] = [];
    }

    const index = priority || 0;
    //@ts-ignore
    this.countryCodes[dialCode][index] = iso2;
  }

  getAll() {
    if (!this.countries) {
      const allCountries = require('./resources/countries.json') as CountryInterface[];
      this.countries = allCountries.sort((a: any, b: any) => b.name - a.name);
    }

    return this.countries;
  }

  getCountryCodes() {
    if (!this.countryCodes.length) {
      this.getAll().map(({ iso2, dialCode, priority, areaCodes }) => {
        this.addCountryCode(iso2, dialCode, priority);
        if (areaCodes) {
          areaCodes.map((areaCode) => {
            this.addCountryCode(iso2, dialCode + areaCode);
          });
        }
      });
    }
    return this.countryCodes;
  }

  getCountryDataByCode(countryCode?: string) {
    if (this.countries) {
      return this.countries?.find(({ iso2 }) => iso2 === countryCode);
    }

    return this.getAll().find(({ iso2 }) => iso2 === countryCode);
  }

  searchCountry(countryName: string) {
    if (this.countries) {
      return this.countries.filter(({ name }) => name.includes(countryName));
    }

    return this.getAll().filter(({ name }) => name.includes(countryName));
  }

  getFlag(countryCode: string) {
    return Flags.get(countryCode);
  }
}

export default Country.getInstance();
