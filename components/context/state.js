import { Context } from "./context";

const State = ({ children }) => {
  const events = {
    events: {},
    on: (eventName, callback) => {
      if (eventName in events.events) events.events[eventName].push(callback);
      else events.events[eventName] = [callback];
    },
    emit: (eventName, data) => {
      if (eventName in events.events)
        events.events[eventName].forEach((callback) => callback(data));
    },
    off: (eventName) => {
      if (typeof eventName === "undefined") events.events = {};
      else events.events[eventName] = [];
    },
  };
  return <Context.Provider value={{ events }}>{children}</Context.Provider>;
};

export default State;
