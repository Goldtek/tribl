//@ts-ignore
import data from './localStates.json'

let instance: null | State = null;

class State {
  private states: null | USStatesInterface[];

  constructor() {
    this.states = null;
  }

  static getInstance() {
    if (!instance) {
      instance = new State();
    }
    return instance;
  }

  getAllStates(): USStatesInterface[] {
    if (!this.states) {
      const allstates = data.states;
      this.states = Object.values(allstates).sort(
        (a: any, b: any) => b.name - a.name
      ) as USStatesInterface[];
    }
    return this.states;
  }

  searchStates(countryName: string): USStatesInterface[] {
    if (this.states) {
      return this.states.filter(({ name }) =>
        name.toLowerCase().includes(countryName.toLowerCase())
      );
    }

    return this.getAllStates().filter(({ name }) =>
      name.toLowerCase().includes(countryName.toLowerCase())
    );
  }
}

export default State.getInstance();

export interface USStatesInterface {
  code: string;
  name: string;
  alphaCode: string
}
