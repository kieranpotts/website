/**
 * Custom rendering of tables. Emits a bare `<table>` – no `.tableblock`
 * class soup, `<colgroup>`, or per-cell `class="tableblock halign-left
 * valign-top"`/`<p class="tableblock">` wrapper. Column alignment is
 * only emitted as an inline style when it diverges from the (left, top)
 * default, so plain tables stay attribute-free.
 */
module.exports = ({ node }) => {
  const rows = node.getRows()
  const title = node.getTitle()
  let html = ''

  if (title) html += `<div class="title">${title}</div>`

  html += '<table>'
  if (rows.head.length) {
    html += '<thead>'
    rows.head.forEach((row) => (html += renderRow(row, 'th')))
    html += '</thead>'
  }
  html += '<tbody>'
  rows.body.forEach((row) => (html += renderRow(row, 'td')))
  html += '</tbody>'
  if (rows.foot.length) {
    html += '<tfoot>'
    rows.foot.forEach((row) => (html += renderRow(row, 'td')))
    html += '</tfoot>'
  }
  html += '</table>'

  return html
}

function renderRow (row, tag) {
  let html = '<tr>'
  row.forEach((cell) => (html += renderCell(cell, tag)))
  html += '</tr>'
  return html
}

function renderCell (cell, tag) {
  const colspan = cell.getColumnSpan()
  const rowspan = cell.getRowSpan()
  const column = cell.getColumn()
  const halign = column ? column.getHorizontalAlign() : 'left'
  const valign = column ? column.getVerticalAlign() : 'top'

  const attrs = []
  if (colspan) attrs.push(`colspan="${colspan}"`)
  if (rowspan) attrs.push(`rowspan="${rowspan}"`)

  const styles = []
  if (halign !== 'left') styles.push(`text-align:${halign}`)
  if (valign !== 'top') styles.push(`vertical-align:${valign}`)
  if (styles.length) attrs.push(`style="${styles.join(';')}"`)

  const attrString = attrs.length ? ` ${attrs.join(' ')}` : ''

  return `<${tag}${attrString}>${renderCellContent(cell)}</${tag}>`
}

function renderCellContent (cell) {
  const style = cell.getStyle()

  if (style === 'literal') return `<pre>${cell.getText()}</pre>`
  if (style === 'asciidoc' && cell.getInnerDocument) return cell.getInnerDocument().convert()

  /* Default (and header/strong/emphasis/monospaced) cell styles: one <p>
  per paragraph in the cell's source. */
  const content = cell.getContent()
  if (Array.isArray(content)) return content.map((p) => `<p>${p}</p>`).join('')

  return `<p>${cell.getText()}</p>`
}
