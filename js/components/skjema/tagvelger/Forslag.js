export function Forslag(text) {
    this.text = text;
    this.id = text.toUpperCase();
}

Forslag.prototype.getText = function () {
    return this.text;
};

Forslag.prototype.getId = function () {
    return this.id;
};
