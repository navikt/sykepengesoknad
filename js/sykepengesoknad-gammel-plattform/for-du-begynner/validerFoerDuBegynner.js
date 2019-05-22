const validate = (values) => {
    const feilmeldinger = {};
    if (!values.ansvarBekreftet) {
        feilmeldinger.ansvarBekreftet = 'Du må bekrefte dette før du går videre';
    }
    return feilmeldinger;
};

export default validate;
