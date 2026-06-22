/**
 * Custom rendering of plain paragraphs.
 */
module.exports = ({ node }) => `<p>${node.getContent()}</p>`
