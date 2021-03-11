module.exports = {
    normalizeErrors: function (errors) {
        let normalizedErrors = [];

        for (var key in errors) {
            if (errors.hasOwnProperty(key)) {
                normalizedErrors.push({ title: key, detail: errors[key].message })
            }
        }

        return normalizedErrors;
    }
}