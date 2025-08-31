// compactLineHelpers.js  (CommonJS for your current Electron setup)

/** Normalize a US phone to ###-###-#### (else returns ""). */
function normalizePhone(text) {
  const m = (text || "").match(/(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/);
  if (!m) return "";
  const d = m[1].replace(/\D/g, "");
  return d.length === 10 ? `${d.slice(0,3)}-${d.slice(3,6)}-${d.slice(6)}` : "";
}

/** Clean unit like "1-12206 • 1" => "1-12206 1" and squeeze spaces. */
function cleanUnit(s) {
  return (s || "").replace(/[•·▪●]+/g, " ").replace(/\s{2,}/g, " ").trim();
}

/** Drop company/owner in parentheses after the community. */
function stripCompanyFromCommunity(s) {
  if (!s) return "";
  const i = s.indexOf("(");
  return (i !== -1 ? s.slice(0, i) : s).trim();
}

/**
 * Parse a single raw table row (tabs or 2+ spaces between columns).
 * Returns { community, resident, unit, phone, compact }
 */
function parseCallRow(input) {
  if (!input) return { community:"", resident:"", unit:"", phone:"", compact:"" };

  const firstLine = input.split(/\r?\n/).map(s => s.trim()).find(Boolean) || "";
  const cols = firstLine.split(/\t+|\s{2,}/).map(s => s.trim()).filter(Boolean);

  let community = "", resident = "", unit = "", phone = "";

  if (cols[0]) community = stripCompanyFromCommunity(cols[0]);

  if (cols[1] && cols[1].toUpperCase() !== "N/A") {
    const m = cols[1].match(/^(.*?)\s*\((.*?)\)\s*$/);
    if (m) {
      resident = (m[1] || "").trim();
      unit     = cleanUnit(m[2] || "");
      if (unit.toUpperCase() === "N/A") unit = "";
    } else {
      resident = cols[1].trim();
    }
  }

  phone = normalizePhone(cols[2] || firstLine);

  const compact = [resident, phone, community, unit].filter(Boolean).join(" ");
  return { community, resident, unit, phone, compact };
}

/**
 * Build your compact line directly from your app fields:
 * fields = { community, unit, resident, phone }
 * => "Name Phone Community Unit"
 */
function buildCompactFromFields(fields) {
  const community = stripCompanyFromCommunity(fields.community || "");
  const unit      = cleanUnit(fields.unit || "");
  const resident  = (fields.resident || "").trim();
  const phone     = normalizePhone(fields.phone || "");

  return [resident, phone, community, unit].filter(Boolean).join(" ");
}

module.exports = {
  normalizePhone,
  cleanUnit,
  stripCompanyFromCommunity,
  parseCallRow,
  buildCompactFromFields,
};
