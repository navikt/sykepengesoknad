const Logger = function () {
    this.error = (...args) => {
        return window.frontendlogger.error(...args);
    };
    this.info = (...args) => {
        return window.frontendlogger.info(...args);
    };
    this.warn = (...args) => {
        return window.frontendlogger.warn(...args);
    };
    this.event = (...args) => {
        return window.frontendlogger.event(...args);
    };
};

export default new Logger();
