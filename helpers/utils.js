function sanitizeVal(inputText) {
    inputText = inputText.replace(/[\t| ]{2,}/g, " ");
    inputText = inputText.replace(/[\n| ]{1,}/g, " ");
    inputText = inputText.trim();
    return inputText;
}

module.exports = {
    sanitizeVal
}