module.exports = (error, req, res, next) => {
    const { message, stack } = error;
    res.json({ message, stack })
}